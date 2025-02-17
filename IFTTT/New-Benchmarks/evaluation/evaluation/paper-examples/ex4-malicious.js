// When you leave home, start recording on your Manything security camera

// Trigger: Location -> You exit an area
//					Location.exitRegionLocation.{OccurredAt, LocationMapImageUrl, LocationMapUrl}
// Action: Manything -> Start recording
//				 Manything.startRecording.{skip, setDuration}

sink('Manything.startRecording', 'setDuration', '15 minutes');
