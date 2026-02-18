<?php

namespace App\Controller;

use App\Entity\Patient;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/patients')]
final class PatientController extends AbstractController
{
    // ─── GET ALL ───────────────────────────────────────────────────────────────
    #[Route('', name: 'app_patient_index', methods: ['GET'])]
    public function index(PatientRepository $patientRepository): Response
    {
        $patients = $patientRepository->findAll();
        $data = array_map(fn(Patient $patient) => $this->serialize($patient), $patients);
        return $this->json($data);
    }

    // ─── GET ONE ───────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_patient_show', methods: ['GET'])]
    public function show(Patient $patient): Response
    {
        return $this->json($this->serialize($patient));
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────
    #[Route('', name: 'app_patient_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $body = json_decode($request->getContent(), true);

        $required = ['firstName', 'lastName', 'dateNaissance', 'gender', 'email', 'description', 'adress', 'bloodGroup'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                return $this->json(['error' => "Le champ '$field' est obligatoire."], 400);
            }
        }

        $dateNaissance = \DateTime::createFromFormat('Y-m-d', $body['dateNaissance']);
        if (!$dateNaissance) {
            return $this->json(['error' => 'Format de date invalide. Utilisez Y-m-d (ex: 1990-05-20).'], 400);
        }

        $patient = new Patient();
        $patient->setFirstName($body['firstName']);
        $patient->setLastName($body['lastName']);
        $patient->setDateNaissance($dateNaissance);
        $patient->setGender($body['gender']);
        $patient->setEmail($body['email']);
        $patient->setDescription($body['description']);
        $patient->setAdress($body['adress']);
        $patient->setBloodGroup($body['bloodGroup']);

        $em->persist($patient);
        $em->flush();

        return $this->json([
            'message' => 'Patient créé avec succès.',
            'patient' => $this->serialize($patient),
        ], 201);
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_patient_edit', methods: ['PUT'])]
    public function edit(Request $request, Patient $patient, EntityManagerInterface $em): Response
    {
        $body = json_decode($request->getContent(), true);

        if (isset($body['firstName']))    $patient->setFirstName($body['firstName']);
        if (isset($body['lastName']))     $patient->setLastName($body['lastName']);
        if (isset($body['gender']))       $patient->setGender($body['gender']);
        if (isset($body['email']))        $patient->setEmail($body['email']);
        if (isset($body['description']))  $patient->setDescription($body['description']);
        if (isset($body['adress']))       $patient->setAdress($body['adress']);
        if (isset($body['bloodGroup']))   $patient->setBloodGroup($body['bloodGroup']);

        if (isset($body['dateNaissance'])) {
            $dateNaissance = \DateTime::createFromFormat('Y-m-d', $body['dateNaissance']);
            if (!$dateNaissance) {
                return $this->json(['error' => 'Format de date invalide. Utilisez Y-m-d (ex: 1990-05-20).'], 400);
            }
            $patient->setDateNaissance($dateNaissance);
        }

        $em->flush();

        return $this->json([
            'message' => 'Patient mis à jour avec succès.',
            'patient' => $this->serialize($patient),
        ]);
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_patient_delete', methods: ['DELETE'])]
    public function delete(Patient $patient, EntityManagerInterface $em): Response
    {
        $em->remove($patient);
        $em->flush();

        return $this->json(['message' => 'Patient supprimé avec succès.']);
    }

    // ─── GET RDVs D'UN PATIENT ─────────────────────────────────────────────────
    #[Route('/{id}/rdvs', name: 'app_patient_rdvs', methods: ['GET'])]
    public function rdvs(Patient $patient): Response
    {
        $data = array_map(fn($rdv) => [
            'id'      => $rdv->getId(),
            'dateRdv' => $rdv->getDateRdv()?->format('Y-m-d'),
            'reason'  => $rdv->getReason(),
            'status'  => $rdv->getStatus(),
            'doctor'  => [
                'id'         => $rdv->getDoctor()?->getId(),
                'firstName'  => $rdv->getDoctor()?->getFirstName(),
                'lastName'   => $rdv->getDoctor()?->getLastName(),
                'speciality' => $rdv->getDoctor()?->getSpeciality(),
            ],
        ], $patient->getRdvs()->toArray());

        return $this->json($data);
    }

    // ─── HELPER ────────────────────────────────────────────────────────────────
    private function serialize(Patient $patient): array
    {
        return [
            'id'            => $patient->getId(),
            'firstName'     => $patient->getFirstName(),
            'lastName'      => $patient->getLastName(),
            'dateNaissance' => $patient->getDateNaissance()?->format('Y-m-d'),
            'gender'        => $patient->getGender(),
            'email'         => $patient->getEmail(),
            'description'   => $patient->getDescription(),
            'adress'        => $patient->getAdress(),
            'bloodGroup'    => $patient->getBloodGroup(),
            'rdvCount'      => $patient->getRdvs()->count(),
        ];
    }
}