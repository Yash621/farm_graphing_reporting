<?php
namespace Drupal\cattle_report\Controller;
use Drupal\Core\Controller\ControllerBase;

/**
 * Provides route responses for the harvest module.
 */
class CattleReportController extends ControllerBase {
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
      '#title' => 'Cattle',
      '#attached' => [
        'library' => [
          'graphs_farmos/graphs-farmos',
        ],
      ],
    ];

    return $render;
  }
}
