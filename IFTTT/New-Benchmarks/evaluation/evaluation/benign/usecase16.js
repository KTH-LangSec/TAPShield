// Example: Flight deals from or to San Francisco
// Applet description
// 
//     Flight deals: San Francisco
//     Get a daily email with flight tickets on sale below $400.00.
// 
// Trigger
// 
//     Twitter: New tweet from search
//     This Applet uses a search field (hidden from the user) with value: (from:SecretFlying OR from:AirFareSpot OR from:FTMileageRuns OR from:ThePointsGuy OR from:airfarewatchdog) AND (SanFrancisco OR "San Francisco" OR SFO OR "SF" OR "SFBayArea" OR OAK OR "Oakland" OR "Bay Area")
// 
// Template for creating an IFTTT Applet

Filter code

var txt = Ingredients.Text || ""
var price = parseInt((txt.match(/\s\$(\d+)\s/) || [])[1])

if (price > 400) {
  EmailDigest.sendDailyEmail.skip("Too expensive")
}

// Action(s)
// 
//     Lifx: change color of lights
