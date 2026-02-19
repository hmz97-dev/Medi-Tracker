<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/_wdt/styles' => [[['_route' => '_wdt_stylesheet', '_controller' => 'web_profiler.controller.profiler::toolbarStylesheetAction'], null, null, null, false, false, null]],
        '/_profiler' => [[['_route' => '_profiler_home', '_controller' => 'web_profiler.controller.profiler::homeAction'], null, null, null, true, false, null]],
        '/_profiler/search' => [[['_route' => '_profiler_search', '_controller' => 'web_profiler.controller.profiler::searchAction'], null, null, null, false, false, null]],
        '/_profiler/search_bar' => [[['_route' => '_profiler_search_bar', '_controller' => 'web_profiler.controller.profiler::searchBarAction'], null, null, null, false, false, null]],
        '/_profiler/phpinfo' => [[['_route' => '_profiler_phpinfo', '_controller' => 'web_profiler.controller.profiler::phpinfoAction'], null, null, null, false, false, null]],
        '/_profiler/xdebug' => [[['_route' => '_profiler_xdebug', '_controller' => 'web_profiler.controller.profiler::xdebugAction'], null, null, null, false, false, null]],
        '/_profiler/open' => [[['_route' => '_profiler_open_file', '_controller' => 'web_profiler.controller.profiler::openAction'], null, null, null, false, false, null]],
        '/api/doctors' => [
            [['_route' => 'app_doctor_index', '_controller' => 'App\\Controller\\DoctorController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_doctor_new', '_controller' => 'App\\Controller\\DoctorController::new'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/patients' => [
            [['_route' => 'app_patient_index', '_controller' => 'App\\Controller\\PatientController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_patient_new', '_controller' => 'App\\Controller\\PatientController::new'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/rdvs' => [
            [['_route' => 'app_rdv_index', '_controller' => 'App\\Controller\\RDVController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_rdv_new', '_controller' => 'App\\Controller\\RDVController::new'], null, ['POST' => 0], null, false, false, null],
        ],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_(?'
                    .'|error/(\\d+)(?:\\.([^/]++))?(*:38)'
                    .'|wdt/([^/]++)(*:57)'
                    .'|profiler/(?'
                        .'|font/([^/\\.]++)\\.woff2(*:98)'
                        .'|([^/]++)(?'
                            .'|/(?'
                                .'|search/results(*:134)'
                                .'|router(*:148)'
                                .'|exception(?'
                                    .'|(*:168)'
                                    .'|\\.css(*:181)'
                                .')'
                            .')'
                            .'|(*:191)'
                        .')'
                    .')'
                .')'
                .'|/api/(?'
                    .'|doctors/([^/]++)(?'
                        .'|(*:229)'
                        .'|/rdvs(*:242)'
                    .')'
                    .'|patients/([^/]++)(?'
                        .'|(*:271)'
                        .'|/rdvs(*:284)'
                    .')'
                    .'|rdvs/([^/]++)(?'
                        .'|(*:309)'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        38 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        57 => [[['_route' => '_wdt', '_controller' => 'web_profiler.controller.profiler::toolbarAction'], ['token'], null, null, false, true, null]],
        98 => [[['_route' => '_profiler_font', '_controller' => 'web_profiler.controller.profiler::fontAction'], ['fontName'], null, null, false, false, null]],
        134 => [[['_route' => '_profiler_search_results', '_controller' => 'web_profiler.controller.profiler::searchResultsAction'], ['token'], null, null, false, false, null]],
        148 => [[['_route' => '_profiler_router', '_controller' => 'web_profiler.controller.router::panelAction'], ['token'], null, null, false, false, null]],
        168 => [[['_route' => '_profiler_exception', '_controller' => 'web_profiler.controller.exception_panel::body'], ['token'], null, null, false, false, null]],
        181 => [[['_route' => '_profiler_exception_css', '_controller' => 'web_profiler.controller.exception_panel::stylesheet'], ['token'], null, null, false, false, null]],
        191 => [[['_route' => '_profiler', '_controller' => 'web_profiler.controller.profiler::panelAction'], ['token'], null, null, false, true, null]],
        229 => [
            [['_route' => 'app_doctor_show', '_controller' => 'App\\Controller\\DoctorController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'app_doctor_edit', '_controller' => 'App\\Controller\\DoctorController::edit'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'app_doctor_delete', '_controller' => 'App\\Controller\\DoctorController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        242 => [[['_route' => 'app_doctor_rdvs', '_controller' => 'App\\Controller\\DoctorController::rdvs'], ['id'], ['GET' => 0], null, false, false, null]],
        271 => [
            [['_route' => 'app_patient_show', '_controller' => 'App\\Controller\\PatientController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'app_patient_edit', '_controller' => 'App\\Controller\\PatientController::edit'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'app_patient_delete', '_controller' => 'App\\Controller\\PatientController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        284 => [[['_route' => 'app_patient_rdvs', '_controller' => 'App\\Controller\\PatientController::rdvs'], ['id'], ['GET' => 0], null, false, false, null]],
        309 => [
            [['_route' => 'app_rdv_show', '_controller' => 'App\\Controller\\RDVController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'app_rdv_edit', '_controller' => 'App\\Controller\\RDVController::edit'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'app_rdv_delete', '_controller' => 'App\\Controller\\RDVController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
