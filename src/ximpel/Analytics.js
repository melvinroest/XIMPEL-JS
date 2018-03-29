ximpel.Analytics = function(){
  this.subjectHistory = [];
}

//ref: ximpel.Player.prototype.playSubject in Player.js -- adds a subject when a subject is played
ximpel.Analytics.prototype.addSubject = function(subject){
  this.sendLastSubjectToDatabase(this.subjectHistory[this.subjectHistory.length-1]);
  this.subjectHistory.push({
    subjectId: subject.getId(),
    startTime: Date.now(),
    mouseMoves: [],
    mouseClicks: [],
    facialExpressionsHistory: []
  });
  console.log('this.subjectHistory');
  console.log(this.subjectHistory);
}

ximpel.Analytics.prototype.sendLastSubjectToDatabase = function(subject){
  $.post('http://localhost:3333/savetodatabase', {subject: subject});
}

//while it captures x,y coordinates for XIMPEL. It is not aware of what
//it clicks on. It could become aware of the HTML5 thing it clicks on
//but not of the XIMPEL xml tags itself.
ximpel.Analytics.prototype.initializeAnalyticsEventHandlers = function(){
  document.getElementsByClassName('ximpelWrapper')[0].addEventListener('mousemove', this.addMouseMove.bind(this));
  document.getElementsByClassName('ximpelWrapper')[0].addEventListener('click', this.addMouseClick.bind(this));
}

ximpel.Analytics.prototype.addMouseMove = function(event){
  var mouseMove = this.createMouseObject(event);
  this.subjectHistory[this.subjectHistory.length-1].mouseMoves.push(mouseMove);
}

ximpel.Analytics.prototype.addMouseClick = function(event){
  var mouseClick = this.createMouseObject(event);
  this.subjectHistory[this.subjectHistory.length-1].mouseClicks.push(mouseClick);
}

//screenWidth and screenHeight are added so that proper data analysis
//for heat maps can be done. E.g. if the window is full screen, then x: 640
//means something different compared to if it isn't full screen
ximpel.Analytics.prototype.createMouseObject = function(event){
  return {
    x: event.clientX,
    y: event.clientY,
    appId: event.path[2].id,
    screenWidth: event.path[2].clientWidth,
    screenHeight: event.path[2].clientHeight
  };
}

//gets called in the startEmotionDetection function
//which gets called in index.htm with: player.startEmotionDetection();
ximpel.Analytics.prototype.addFacialExpressions = function(facialExpressions){

  this.subjectHistory[this.subjectHistory.length-1].facialExpressionsHistory.push(facialExpressions);
}