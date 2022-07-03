<?php

namespace Drupal\graphs_farmos\Element;

use Drupal\Core\Render\Element\RenderElement;

/**
 * Provides a marquee render element.
 *
 * New render element types are defined as plugins. They live in the
 * Drupal\{module_name}\Element namespace and implement
 * \Drupal\Core\Render\Element\ElementInterface. They are annotated with either
 * \Drupal\Core\Render\Annotation\RenderElement or
 * \Drupal\Core\Render\Annotation\FormElement. And extend either the
 * \Drupal\Core\Render\Element\RenderElement, or
 * \Drupal\Core\Render\Element\FormElement base classes.
 *
 * In the annotation below we define the string "marquee" as the ID for this
 * plugin. That will also be the value used for the '#type' property in a render
 * array. For example:
 *
 * @code
 * $build['awesome'] = [
 *   '#type' => 'marquee',
 *   '#content' => 'Whoa cools, a marquee!',
 * ];
 * @endcode
 *
 * View an example of this custom element in use in
 * \Drupal\render_example\Controller\RenderExampleController::arrays().
 *
 * @see plugin_api
 * @see render_example_theme()
 *
 * @RenderElement("graphs_farmos")
 */

class GraphsFarmos extends RenderElement {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $class = get_class($this);

    return [
      // See render_example_theme() where this new theme hook is declared.
      '#theme' => 'graphs_farmos',
      '#content' => 'hello',
    ];
  }

  /**
   * Pre-render callback; Process custom attribute options.
   *
   * @param array $element
   *   The renderable array representing the element with '#type' => 'marquee'
   *   property set.
   *
   * @return array mixed
   *   The passed in element with changes made to attributes depending on
   *   context.
   */
}
