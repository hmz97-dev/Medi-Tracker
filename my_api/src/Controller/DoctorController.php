<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Repository\DoctorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/doctors')]
final class DoctorController extends AbstractController
{
    // ─── GET ALL ───────────────────────────────────────────────────────────────
    #[Route('', name: 'app_doctor_index', methods: ['GET'])]
    public function index(DoctorRepository $doctorRepository): Response
    {
        $doctors = $doctorRepository->findAll();
        $data = array_map(fn(Doctor $doctor) => $this->serialize($doctor), $doctors);
        return $this->json($data);
    }

    // ─── GET ONE ───────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_doctor_show', methods: ['GET'])]
    public function show(Doctor $doctor): Response
    {
        return $this->json($this->serialize($doctor));
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────
    #[Route('', name: 'app_doctor_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $body = json_decode($request->getContent(), true);

        $required = ['firstName', 'lastName', 'email', 'phoneNumber', 'speciality', 'description'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                return $this->json(['error' => "Le champ '$field' est obligatoire."], 400);
            }
        }

        $doctor = new Doctor();
        $doctor->setFirstName($body['firstName']);
        $doctor->setLastName($body['lastName']);
        $doctor->setEmail($body['email']);
        $doctor->setPhoneNumber($body['phoneNumber']);
        $doctor->setSpeciality($body['speciality']);
        $doctor->setDescription($body['description']);

        $em->persist($doctor);
        $em->flush();

        return $this->json([
            'message' => 'Docteur créé avec succès.',
            'doctor'  => $this->serialize($doctor),
        ], 201);
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_doctor_edit', methods: ['PUT'])]
    public function edit(Request $request, Doctor $doctor, EntityManagerInterface $em): Response
    {
        $body = json_decode($request->getContent(), true);

        if (isset($body['firstName']))   $doctor->setFirstName($body['firstName']);
        if (isset($body['lastName']))    $doctor->setLastName($body['lastName']);
        if (isset($body['email']))       $doctor->setEmail($body['email']);
        if (isset($body['phoneNumber'])) $doctor->setPhoneNumber($body['phoneNumber']);
        if (isset($body['speciality']))  $doctor->setSpeciality($body['speciality']);
        if (isset($body['description'])) $doctor->setDescription($body['description']);

        $em->flush();

        return $this->json([
            'message' => 'Docteur mis à jour avec succès.',
            'doctor'  => $this->serialize($doctor),
        ]);
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_doctor_delete', methods: ['DELETE'])]
    public function delete(Doctor $doctor, EntityManagerInterface $em): Response
    {
        $em->remove($doctor);
        $em->flush();

        return $this->json(['message' => 'Docteur supprimé avec succès.']);
    }

    // ─── GET RDVs D'UN DOCTEUR ─────────────────────────────────────────────────
    #[Route('/{id}/rdvs', name: 'app_doctor_rdvs', methods: ['GET'])]
    public function rdvs(Doctor $doctor): Response
    {
        $data = array_map(fn($rdv) => [
            'id'      => $rdv->getId(),
            'dateRdv' => $rdv->getDateRdv()?->format('Y-m-d'),
            'reason'  => $rdv->getReason(),
            'status'  => $rdv->getStatus(),
            'patient' => [
                'id'        => $rdv->getPatient()?->getId(),
                'firstName' => $rdv->getPatient()?->getFirstName(),
                'lastName'  => $rdv->getPatient()?->getLastName(),
            ],
        ], $doctor->getRdvs()->toArray());

        return $this->json($data);
    }

    // ─── HELPER ────────────────────────────────────────────────────────────────
    private function serialize(Doctor $doctor): array
    {
        return [
            'id'          => $doctor->getId(),
            'firstName'   => $doctor->getFirstName(),
            'lastName'    => $doctor->getLastName(),
            'email'       => $doctor->getEmail(),
            'phoneNumber' => $doctor->getPhoneNumber(),
            'speciality'  => $doctor->getSpeciality(),
            'description' => $doctor->getDescription(),
            'rdvCount'    => $doctor->getRdvs()->count(),
        ];
    }
}