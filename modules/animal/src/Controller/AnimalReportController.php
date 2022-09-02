<?php
namespace Drupal\animal_report\Controller;
use Drupal\Core\Controller\ControllerBase;

/**
 * Provides route responses for the harvest module.
 */
class AnimalReportController extends ControllerBase {
  /**
   * Returns a simple page.
   *
   * @return array
   *   A simple renderable array.
   */
  public function report() {
    $render = [];

    $render['chart_1'] = [
      '#type' => 'graphs_farmos',
      '#title' => 'Animal',
      '#attached' => [
        'library' => [
          'graphs_farmos/graphs-farmos',
        ],
      ],
    ];

    return $render;
  }
}
