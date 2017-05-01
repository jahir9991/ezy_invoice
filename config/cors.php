<?php
return [
    'defaults' => [
        'supportsCredentials' => false,
        'allowedOrigins' => ['*'],
        'allowedHeaders' => ['*'],
        'allowedMethods' => ['*'],
        'exposedHeaders' => ['*'],
        'maxAge' => 3600,
//        'hosts' => ['*'],
    ],

    'paths' => [
        'v1/*' => [
            'allowedOrigins' => ['*'],
            'allowedHeaders' => ['*'],
            'allowedMethods' => ['*'],
            'maxAge' => 3600,
        ],
    ],
];
