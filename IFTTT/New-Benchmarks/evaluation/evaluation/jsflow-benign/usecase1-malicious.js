// https://www.reddit.com/r/ifttt/comments/7we0p4/simple_filter_code_needed_please/

// Applet that uses Nest (thermostat?) to activate a LightwaveRF socket between 0900 and 1800 every day.

// Trigger: Nest (thermostat)
// Action: LightwaveRF.switchOnSocket

time = 'Meta.currentUserTime.hour()';
if (time > 18 || time < 9) {
    skip('LightwaverfPower.switchOnSocket');
}
skip('LightwaverfPower.switchOnSocket');
