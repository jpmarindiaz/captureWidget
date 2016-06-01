
#' @export
captureWidget <- function(elementId, 
                           buttonTop = NULL,
                           buttonLeft = NULL,
                           buttonWidth = NULL,
                           buttonHeight = NULL,
                           buttonText = NULL,
                           captureWidth = NULL,
                           captureHeight = NULL,
                           showButton = TRUE,
                      width = NULL, height = NULL) {

    
  settings = list(
    buttonTop = buttonTop,
    buttonLeft = buttonLeft,
    buttonWidth = buttonWidth,
    buttonHeight = buttonHeight,
    buttonText = buttonText,
    captureWidth = captureWidth,
    captureHeight = captureHeight,
    showButton = showButton
  )
  x <- list(
    elementId = elementId,
    settings = settings
    )
  # create widget
  htmlwidgets::createWidget(
    name = 'screenCaptureR',
    x,
    width = width,
    height = height,
    package = 'screenCaptureR',
    sizingPolicy = sizingPolicy(
      defaultWidth = "100%",
      defaultHeight = 500
    )
  )
}

#' @export
captureWidgetOutput <- function(outputId, width = '100%', height = '500px'){
  shinyWidgetOutput(outputId, 'captureWidget', width, height, package = 'captureWidget')
}

#' @export
renderCaptureWidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, captureWidgetOutput, env, quoted = TRUE)
}
