<?php

namespace App\Controller;

use App\Entity\RDV;
use App\Repository\RDVRepository;
use App\Repository\DoctorRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/rdvs')]
final class RDVController extends AbstractController
{
    // ─── GET ALL ───────────────────────────────────────────────────────────────
    #[Route('', name: 'app_rdv_index', methods: ['GET'])]
    public function index(RDVRepository $rdvRepository): Response
    {
        $rdvs = $rdvRepository->findAll();
        $data = array_map(fn(RDV $rdv) => $this->serialize($rdv), $rdvs);
        return $this->json($data);
    }

    // ─── GET ONE ───────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_rdv_show', methods: ['GET'])]
    public function show(RDV $rdv): Response
    {
        return $this->json($this->serialize($rdv));
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────
    #[Route('', name: 'app_rdv_new', methods: ['POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $em,
        DoctorRepository $doctorRepository,
        PatientRepository $patientRepository
    ): Response {
        $body = json_decode($request->getContent(), true);

        $required = ['dateRdv', 'reason', 'status', 'doctorId', 'patientId'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                return $this->json(['error' => "Le champ '$field' est obligatoire."], 400);
            }
        }

        $dateRdv = \DateTime::createFromFormat('Y-m-d', $body['dateRdv']);
        if (!$dateRdv) {
            return $this->json(['error' => 'Format de date invalide. Utilisez Y-m-d (ex: 2025-06-15).'], 400);
        }

        $doctor = $doctorRepository->find($body['doctorId']);
        if (!$doctor) {
            return $this->json(['error' => "Docteur #{$body['doctorId']} introuvable."], 404);
        }

        $patient = $patientRepository->find($body['patientId']);
        if (!$patient) {
            return $this->json(['error' => "Patient #{$body['patientId']} introuvable."], 404);
        }

        $rdv = new RDV();
        $rdv->setDateRdv($dateRdv);
        $rdv->setReason($body['reason']);
        $rdv->setStatus($body['status']);
        $rdv->setDoctor($doctor);
        $rdv->setPatient($patient);

        $em->persist($rdv);
        $em->flush();

        return $this->json([
            'message' => 'RDV créé avec succès.',
            'rdv'     => $this->serialize($rdv),
        ], 201);
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_rdv_edit', methods: ['PUT'])]
    public function edit(
        Request $request,
        RDV $rdv,
        EntityManagerInterface $em,
        DoctorRepository $doctorRepository,
        PatientRepository $patientRepository
    ): Response {
        $body = json_decode($request->getContent(), true);

        if (isset($body['dateRdv'])) {
            $dateRdv = \DateTime::createFromFormat('Y-m-d', $body['dateRdv']);
            if (!$dateRdv) {
                return $this->json(['error' => 'Format de date invalide. Utilisez Y-m-d (ex: 2025-06-15).'], 400);
            }
            $rdv->setDateRdv($dateRdv);
        }

        if (isset($body['reason']))    $rdv->setReason($body['reason']);
        if (isset($body['status']))    $rdv->setStatus($body['status']);

        if (isset($body['doctorId'])) {
            $doctor = $doctorRepository->find($body['doctorId']);
            if (!$doctor) {
                return $this->json(['error' => "Docteur #{$body['doctorId']} introuvable."], 404);
            }
            $rdv->setDoctor($doctor);
        }

        if (isset($body['patientId'])) {
            $patient = $patientRepository->find($body['patientId']);
            if (!$patient) {
                return $this->json(['error' => "Patient #{$body['patientId']} introuvable."], 404);
            }
            $rdv->setPatient($patient);
        }

        $em->flush();

        return $this->json([
            'message' => 'RDV mis à jour avec succès.',
            'rdv'     => $this->serialize($rdv),
        ]);
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────
    #[Route('/{id}', name: 'app_rdv_delete', methods: ['DELETE'])]
    public function delete(RDV $rdv, EntityManagerInterface $em): Response
    {
        $em->remove($rdv);
        $em->flush();

        return $this->json(['message' => 'RDV supprimé avec succès.']);
    }

    // ─── HELPER ────────────────────────────────────────────────────────────────
    private function serialize(RDV $rdv): array
    {
        return [
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
            'patient' => [
                'id'         => $rdv->getPatient()?->getId(),
                'firstName'  => $rdv->getPatient()?->getFirstName(),
                'lastName'   => $rdv->getPatient()?->getLastName(),
                'bloodGroup' => $rdv->getPatient()?->getBloodGroup(),
            ],
        ];
    }
}