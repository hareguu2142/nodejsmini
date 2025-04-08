let canvasWidth = 600;
let canvasHeight = 500; // Height to accommodate text below
let centerX, centerY;
let radius = 150; // Visual radius (scaled unit radius)
let currentAngle = 0; // Angle in degrees

// Colors
const cosColor = '#FF0000'; // Red
const sinColor = '#00AA00'; // Green
const tanColor = '#FF9900'; // Orange
const hypColor = '#0000FF'; // Blue
const circleColor = '#333333';
const guideColor = '#CCCCCC';
const textColor = '#000000';
const bgColor = '#FFFFFF';


function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container'); // Place canvas in the div
  centerX = canvasWidth / 2;
  centerY = canvasWidth / 2; // Center Y based on the circular area, leave space below
  angleMode(DEGREES); // Use degrees for calculations and display
}

function draw() {
  background(bgColor);

  // Calculate angle based on mouse position relative to center
  // atan2 gives angle in range -180 to 180
  let mouseAngle = atan2(mouseY - centerY, mouseX - centerX);

  // Check if mouse is within a reasonable area to avoid jumpy behavior at setup
  if (dist(mouseX, mouseY, centerX, centerY) > 10) {
      currentAngle = mouseAngle;
  }

  // --- Main Drawing: Translate origin to center ---
  translate(centerX, centerY);

  // Draw coordinate axes
  stroke(guideColor);
  strokeWeight(1);
  line(-centerX, 0, centerX, 0); // X-axis
  line(0, -centerY, 0, canvasHeight - centerY); // Y-axis (adjust length)

  // Draw the unit circle
  noFill();
  stroke(circleColor);
  strokeWeight(2);
  ellipse(0, 0, radius * 2, radius * 2);

  // Calculate current point on the circle
  let x = radius * cos(currentAngle);
  let y = radius * sin(currentAngle);

  // --- Draw Trigonometric Lines ---

  // 1. Cosine (Adjacent side) - Red
  stroke(cosColor);
  strokeWeight(3);
  line(0, 0, x, 0);

  // 2. Sine (Opposite side) - Green
  stroke(sinColor);
  strokeWeight(3);
  line(x, 0, x, y);

  // 3. Hypotenuse (Radius) - Blue
  stroke(hypColor);
  strokeWeight(2);
  line(0, 0, x, y);

  // 4. Tangent line - Orange
  // tan(theta) = y_tan / radius => y_tan = radius * tan(theta)
  let tanVal = tan(currentAngle);
  // Limit the visual length of the tangent line to avoid extreme values near 90/270 deg
  let tanY = constrain(radius * tanVal, -height * 2, height * 2);
  stroke(tanColor);
  strokeWeight(3);
  // Draw the vertical tangent line segment at x = radius
  line(radius, 0, radius, tanY);
  // Draw guide line from origin to the tangent point intersection
  stroke(tanColor + '55'); // Lighter tangent color for guide
  strokeWeight(1);
  line(0, 0, radius, tanY); // Connects origin to the end of the tangent segment


  // --- Draw Helper Visuals ---

  // Point on the circle
  fill(textColor);
  noStroke();
  ellipse(x, y, 8, 8);

  // Angle Arc
  noFill();
  stroke(hypColor + '99'); // Semi-transparent blue
  strokeWeight(1);
  let arcSize = 40;
  if (currentAngle >= 0) {
      arc(0, 0, arcSize, arcSize, 0, currentAngle);
  } else {
      arc(0, 0, arcSize, arcSize, currentAngle, 0); // Draw clockwise for negative angles
  }
  // Angle text near arc
  fill(hypColor);
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  text(nf(currentAngle, 0, 1) + "°", arcSize * 0.7 * cos(currentAngle / 2), arcSize * 0.7 * sin(currentAngle / 2));


  // --- Display Text Values (Outside the translated coordinates) ---
  resetMatrix(); // Return to default top-left origin for text positioning
  fill(textColor);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  let textX = 20;
  let textY = centerY + radius + 30; // Position text below the circle
  let lineHeight = 20;

  // Calculate actual trig values (independent of visual radius)
  let cosValue = cos(currentAngle);
  let sinValue = sin(currentAngle);
  let tanValue = tan(currentAngle);

  // Format numbers nicely
  let angleDisplay = nf(currentAngle, 0, 2) + "°";
  // Handle potential floating point inaccuracies near 0, 1, -1
  let cosDisplay = abs(cosValue) < 0.0001 ? "0.000" : nf(cosValue, 0, 3);
  let sinDisplay = abs(sinValue) < 0.0001 ? "0.000" : nf(sinValue, 0, 3);
  let tanDisplay;
  if (abs(cosValue) < 0.0001) { // Check for near 90/270 degrees
      tanDisplay = (sinValue > 0 ? "+∞" : "-∞");
  } else {
      tanDisplay = nf(tanValue, 0, 3);
  }


  text("각도 (θ): " + angleDisplay, textX, textY);
  fill(cosColor);
  text("cos(θ) = " + cosDisplay, textX, textY + lineHeight * 1);
  fill(sinColor);
  text("sin(θ) = " + sinDisplay, textX, textY + lineHeight * 2);
  fill(tanColor);
  text("tan(θ) = " + tanDisplay, textX, textY + lineHeight * 3);

  // Add labels near lines (back inside translated coords briefly)
  translate(centerX, centerY); // Translate back to center
  textSize(12);
  textAlign(CENTER);

  // Cos Label (adjust position based on angle)
  fill(cosColor);
  if (abs(y) > 10) { // Avoid overlap when near 0/180 deg
      text("cos θ", x / 2, (x>0 ? 1 : -1) * 15); // Place above/below axis
  }

  // Sin Label (adjust position based on angle)
  fill(sinColor);
   if (abs(x) > 10) { // Avoid overlap when near 90/270 deg
     text("sin θ", x + (y>0 ? 1 : -1) * 15, y / 2); // Place left/right of line
   }


  // Tan Label (place near the tangent line)
  fill(tanColor);
  textAlign(LEFT, CENTER);
  // Only show tan label if it's not excessively large
  if (abs(tanY) < height * 1.5) {
     text("tan θ", radius + 5, tanY / 2);
  }

}