

library(devtools)
load_all()
document()
install()

library(captureWidget)

# library(htmltools)
# html <- tagList(
#     HTML('<svg id = "svg_to_export" width="333" height="200">
#   <text x="50" y="100" text-anchor="start" dy="14" style="font-family:\'Indie Flower\';font-size:36pt;font-weight:300;">Custom SVG Text</text>
#   </svg>')
#   ,captureWidget("svg_to_export",showButton = TRUE)
# )
# #html_print(html) #export not working in
# html_print(html, viewer = utils::browseURL ) #export not working in
# #captureWidget()



library(shiny)
library(bubbles)
app <- shinyApp(
  ui = bootstrapPage(
    column(6,
           bubblesOutput("bubbles"),
           actionButton("do", "Click Me"),
           verbatimTextOutput("debug"),
           br()
    ),
    column(6,
           uiOutput("result"),
           br()
    )
  ),
  server = function(input, output) {
    
    currentSvgId <- reactive("bubbles")
    
    output$debug <- renderPrint({
      paste("currentSvgId",currentSvgId(),
            #"currentSvgId2",currentSvgId2(),
            "captureWidget_foundSvg: ",input$captureWidget_foundSvg,
            "captureWidget_width: ",input$captureWidget_width,
            "captureWidget_height: ",input$captureWidget_height,
            "captureWidget_aspectRatio: ",input$captureWidget_aspectRatio,
            "captureWidget_imgDataURL: ",input$captureWidget_imgDataURL)
    })
    output$bubbles <- renderBubbles({
      bubbles(value = runif(26), label = LETTERS,
              color = rainbow(26, alpha=NULL)[sample(26)]
      )
    })
    output$result <- renderUI({
      c <- captureWidget(currentSvgId(), showButton = FALSE)
      list(
        img(src=input$captureWidget_imgDataURL, width = "100%"),
        conditionalPanel(input$do,
                         renderCaptureWidget(c)
        )
      )
    })
  }
)
runApp(app)





library(shiny)
app <- shinyApp(
  ui = bootstrapPage(
    column(6,
      selectInput("svgId","SVG ID",c("redRectangle","blueRectangle","noSvg")),
      uiOutput("tmpSvg"),
      verbatimTextOutput("debug"),
      br()
    ),
    column(6,
      uiOutput("result"),
      captureWidgetOutput("screen")
    )
  ),
  server = function(input, output) {
    
        currentSvgId <- reactive({
          input$svgId
        })

    output$debug <- renderPrint({
      #!is.null(input$imgDataURL)
      #input$imgDataURL
      #currentSvgId()
      paste("currentSvgId",currentSvgId(),
            #"currentSvgId2",currentSvgId2(),
            "captureWidget_foundSvg: ",input$captureWidget_foundSvg,
            "captureWidget_width: ",input$captureWidget_width,
            "captureWidget_height: ",input$captureWidget_height,
            "captureWidget_aspectRatio: ",input$captureWidget_aspectRatio,
            "captureWidget_imgDataURL: ",input$captureWidget_imgDataURL)
    })
    output$tmpSvg <- renderUI({
      list(
        HTML('<div id="redRectangle"><svg width="200" height="100"><g transform="translate(50,50)"><rect height="100" width="200" fill="red"/></g></svg>
        </div>'),
        HTML('<div ><svg id="blueRectangle" width="200" height="100"><g transform="translate(50,50)"><rect height="100" width="200" fill="blue"/></g></svg>
        </div>'),
        h1("Selected")
      )
    })
    output$screen <- renderCaptureWidget({
      #if(is.null(input$svgId)) return()
      message(currentSvgId())
      captureWidget(currentSvgId(), showButton = FALSE)
    })
    
    output$result <- renderUI({
      list(
        img(src=input$captureWidget_imgDataURL)
      )
    })
  }
)
runApp(app)






