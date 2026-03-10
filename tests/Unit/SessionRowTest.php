<?php

use App\Models\SessionRow;

test('volume is sets × reps × weight', function () {
    $row = new SessionRow(['sets' => 3, 'reps' => 10, 'weight' => 100.00]);

    expect($row->volume)->toBe(3000.0);
});

test('volume with decimal weight', function () {
    $row = new SessionRow(['sets' => 5, 'reps' => 5, 'weight' => 62.50]);

    expect($row->volume)->toBe(1562.5);
});

test('one_rep_max uses Epley formula', function () {
    $row = new SessionRow(['sets' => 3, 'reps' => 10, 'weight' => 100.00]);

    // Epley: 100 × (1 + 10/30) = 133.33
    expect($row->one_rep_max)->toBe(133.33);
});

test('one_rep_max with 1 rep equals weight', function () {
    $row = new SessionRow(['sets' => 1, 'reps' => 1, 'weight' => 140.00]);

    // Epley: 140 × (1 + 1/30) = 144.67
    expect($row->one_rep_max)->toBe(144.67);
});

test('one_rep_max returns 0 when reps is 0', function () {
    $row = new SessionRow(['sets' => 3, 'reps' => 0, 'weight' => 100.00]);

    expect($row->one_rep_max)->toBe(0);
});

test('warmup_sets returns 3 progressive sets', function () {
    $row = new SessionRow(['sets' => 3, 'reps' => 5, 'weight' => 100.00]);

    expect($row->warmup_sets)->toBe([
        ['weight' => 50.0, 'reps' => 10],
        ['weight' => 70.0, 'reps' => 5],
        ['weight' => 85.0, 'reps' => 3],
    ]);
});

test('warmup_sets returns empty array when weight is 0', function () {
    $row = new SessionRow(['sets' => 3, 'reps' => 5, 'weight' => 0]);

    expect($row->warmup_sets)->toBe([]);
});

test('warmup_sets handles decimal weights', function () {
    $row = new SessionRow(['sets' => 3, 'reps' => 5, 'weight' => 75.50]);

    expect($row->warmup_sets)->toBe([
        ['weight' => 37.75, 'reps' => 10],
        ['weight' => 52.85, 'reps' => 5],
        ['weight' => 64.18, 'reps' => 3],
    ]);
});
