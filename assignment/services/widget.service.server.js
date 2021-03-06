module.exports=function(app) {

  let widgets = [
    {"_id": "123", "name": "Heading 1", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
    {"_id": "234", "name": "Heading 2", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    {
      "_id": "345", "name": "Image 1", "text": "shuffling image", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
      "url": "http://lorempixel.com/400/200/"
    },
    {"_id": "567", "name": "Heading 3", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    {
      "_id": "678", "widgetType": "YOUTUBE", "name": "Youtube 1", "text": "boat video", "pageId": "321", "width": "100%",
      "url": "https://www.youtube.com/embed/AM2Ivdi9c4E"
    }
  ];

  const widgetModel = require('../model/widget/widget.model.server');

  app.post("/api/page/:pageId/widget", createWidget);
  function createWidget(req, res) {
    let pageId = req.params.pageId;
    let body = req.body;
    var widget = {};

    if (body.widgetType === "HEADING") {
      widget = {
        "name": body.name,
        "widgetType": "HEADING",
        "pageId": pageId,
        "size": body.size,
        "text": body.text
      }
    } else if (body.widgetType === "IMAGE") {
      widget = {
        "name": body.name,
        "widgetType": "IMAGE",
        "pageId": pageId,
        "width": body.width,
        "url": body.url
      }
    } else if (body.widgetType === "YOUTUBE") {
      widget = {
        "name": body.name,
        "widgetType": "YOUTUBE",
        "pageId": pageId,
        "width": body.width,
        "url": body.url
      }
    } else if (body.widgetType === "HTML") {
      widget = {
        "name": body.name,
        "text": body.text,
        "pageId": pageId,
        "widgetType": "HTML"
      }
    } else if (body.widgetType === "TEXT") {
      widget = {
        "name": body.name,
        "text": body.text,
        "pageId": pageId,
        "placeholder": body.placeholder,
        "rows": body.rows,
        "formatted": body.formatted,
        "widgetType": "TEXT"
      }
    } else {
      res.status(400).send("Invalid widget type");
      return;
    }

    widgetModel
      .createWidget(widget)
      .then(
        function(widget) {
          res.status(200).send(widget);
        },
        function(error){
          res.status(400).send(error);
        }
      );

  }


  app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
  function findAllWidgetsForPage(req, res) {
    let pageId = req.params.pageId;
    widgetModel.findAllWidgetsForPage(pageId)
      .then(
        function(widgets) {
          res.status(200).send(widgets);
        },
        function(error) {
          res.status(400).send(error);
        }
      );
  }

  app.get("/api/widget/:widgetId", findWidgetById);
  function findWidgetById(req, res) {
    let widgetId = req.params.widgetId;
    widgetModel.findWidgetById(widgetId)
      .then(
        function (page) {
          if (page) {
            console.log("page found!");
            res.status(200).send(page);
          } else {
            console.log("no page found");
            res.status(404).send({error_msg: "page not found"});
          }
        },
        function (error) {
          //console.log(error);
          res.status(400).send(error);
        }
      );
  }

  app.put("/api/widget/:widgetId", updateWidget);

  function updateWidget(req, res) {
    let widgetId = req.params.widgetId;
    let body = req.body;
    widgetModel.updateWidget(widgetId, body)
      .then(
        function(widget) {
          if (widget){
            console.log("widget found!");
            res.status(200).send(widget);
          } else {
            console.log("no widget found");
            res.status(404).send({error_msg: "widget not found"});
          }
        },
        function (error) {
          //console.log(error);
          res.status(400).send(error);
        }
      );
  }

  app.delete("/api/widget/:widgetId", deleteWidget);
  function deleteWidget(req, res) {
    let widgetId = req.params.widgetId;
    widgetModel.deleteWidget(widgetId)
      .then(
        function (widget) {
          if (widget){
            console.log("widget deleted!");
            res.status(200).send({message: "widget deleted"});
          } else {
            console.log("no widget found");
            res.status(404).send({error_msg: "widget not found"});
          }
        },
        function (error) {
          console.log(error);
          res.status(400).send(error);
        }
      );
  }


  // app.post("/api/page/:pageId/widget", createWidget);
  // function createWidget(req, res) {
  //   let pageId = req.params.pageId
  //   let body = req.body;
  //   var id = Math.random().toString();
  //   var widget = {}
  //
  //   if (body.widgetType === "HEADING") {
  //     widget = {
  //       "_id": id,
  //       "name": body.name,
  //       "widgetType": "HEADING",
  //       "pageId": pageId,
  //       "size": body.size,
  //       "text": body.text
  //     }
  //   } else if (body.widgetType === "IMAGE") {
  //     widget = {
  //       "_id": id,
  //       "name": body.name,
  //       "widgetType": "IMAGE",
  //       "pageId": pageId,
  //       "width": body.width,
  //       "url": body.url
  //     }
  //   } else if (body.widgetType === "YOUTUBE") {
  //     widget = {
  //       "_id": id,
  //       "name": body.name,
  //       "widgetType": "YOUTUBE",
  //       "pageId": pageId,
  //       "width": body.width,
  //       "url": body.url
  //     }
  //   } else {
  //     res.status(400).send("Invalid widget type");
  //     return;
  //   }
  //   widgets.push(widget);
  //   res.status(200).json(widget)
  // }
  //
  // app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
  //
  // function findAllWidgetsForPage(req, res) {
  //   let pageId = req.params.pageId
  //   let list = [];
  //   for (var i in widgets) {
  //     if (widgets[i].pageId === pageId) {
  //       list.push(widgets[i]);
  //     }
  //   }
  //   res.status(200).send(list);
  // }

  // app.get("/api/widget/:widgetId", findWidgetById);
  //
  // function findWidgetById(req, res) {
  //   let widgetId = req.params.widgetId
  //   for (var i in widgets) {
  //     if (widgets[i]._id === widgetId) {
  //       res.status(200).send(widgets[i]);
  //       return
  //     }
  //   }
  //   res.status(404).send("widget not found!");
  // }


  // app.put("/api/widget/:widgetId", updateWidget);
  //
  // function updateWidget(req, res) {
  //   let widgetId = req.params.widgetId
  //   let body = req.body
  //   for (var i in widgets) {
  //     if (widgets[i]._id === widgetId) {
  //       let newWidget = {}
  //       if (widgets[i].widgetType === "HEADING") {
  //         newWidget = {
  //           "_id": widgetId,
  //           "widgetType": "HEADING",
  //           "pageId": widgets[i].pageId,
  //           "name": body.name,
  //           "size": body.size,
  //           "text": body.text
  //
  //         }
  //         widgets[i].name = body.name;
  //         widgets[i].size = body.size;
  //         widgets[i].text = body.text;
  //       } else if (widgets[i].widgetType === "IMAGE") {
  //         newWidget = {
  //           "_id": widgetId,
  //           "widgetType": "IMAGE",
  //           "pageId": widgets[i].pageId,
  //           "width": body.width,
  //           "url": body.url
  //         }
  //         widgets[i].name = body.name;
  //         widgets[i].width = body.width;
  //         widgets[i].url = body.url;
  //         widgets[i].text = body.text;
  //       } else if (widgets[i].widgetType === "YOUTUBE") {
  //         newWidget = {
  //           "_id": widgetId,
  //           "widgetType": "YOUTUBE",
  //           "pageId": widgets[i].pageId,
  //           "width": body.width,
  //           "url": body.url
  //         }
  //         widgets[i].name = body.name;
  //         widgets[i].width = body.width;
  //         widgets[i].url = body.url;
  //         widgets[i].text = body.text;
  //       } else {
  //         let response = {
  //           message: "Invalid widget type"
  //         }
  //         res.status(400).send(response);
  //         return;
  //       }
  //       //widgets[i] = newWidget;
  //       res.send(widgets[i]);
  //       return;
  //     }
  //   }
  //   res.status(404).send("widget not found!");
  // }

  // app.delete("/api/widget/:widgetId", deleteWidget);
  // function deleteWidget(req, res) {
  //   let widgetId = req.params.widgetId
  //   for (var i in widgets) {
  //     if (widgets[i]._id === widgetId) {
  //       widgets.splice(i, 1);
  //       let response = {
  //         message: "website deleted"
  //       }
  //       res.status(200).send(response);
  //       return;
  //     }
  //   }
  //   let response = {
  //     message: "widget not found"
  //   }
  //   res.status(404).send(response)
  // }

  function array_swap(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }

  app.put("/api/page/:pageId/widget",reorderWidgets);
  function reorderWidgets(req,res) {

    var startIndex = parseInt(req.query["start"]);
    var endIndex = parseInt(req.query["end"]);

    array_swap(widgets, startIndex, endIndex);
    res.sendStatus(200);

  }
};

