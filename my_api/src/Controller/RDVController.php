<?php

namespace App\Controller;

use App\Entity\RDV;
use App\Form\RDVType;
use App\Repository\RDVRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/r/d/v')]
final class RDVController extends AbstractController
{
    #[Route(name: 'app_r_d_v_index', methods: ['GET'])]
    public function index(RDVRepository $rDVRepository): Response
    {
        return $this->render('rdv/index.html.twig', [
            'r_d_vs' => $rDVRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_r_d_v_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $rDV = new RDV();
        $form = $this->createForm(RDVType::class, $rDV);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($rDV);
            $entityManager->flush();

            return $this->redirectToRoute('app_r_d_v_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('rdv/new.html.twig', [
            'r_d_v' => $rDV,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_r_d_v_show', methods: ['GET'])]
    public function show(RDV $rDV): Response
    {
        return $this->render('rdv/show.html.twig', [
            'r_d_v' => $rDV,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_r_d_v_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, RDV $rDV, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(RDVType::class, $rDV);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_r_d_v_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('rdv/edit.html.twig', [
            'r_d_v' => $rDV,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_r_d_v_delete', methods: ['POST'])]
    public function delete(Request $request, RDV $rDV, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$rDV->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($rDV);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_r_d_v_index', [], Response::HTTP_SEE_OTHER);
    }
}
