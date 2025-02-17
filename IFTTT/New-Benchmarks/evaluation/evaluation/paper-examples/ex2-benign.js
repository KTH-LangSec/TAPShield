// Keep a list of notes to email yourself at the end of the day

// Trigger: Google Assistant -> Say a phrase with a text ingredient
//					GoogleAssistant.voiceTriggerWithOneTextIngredient.{CreatedAt, TextField}
// Action: Email Digest -> Add to email digest
//				 EmailDigest.sendDailyEmail.{skip, setTimeOfDay, setTitle, setMessage, setUrl}

notes = urlh(encodeURIComponent(lbl('GoogleAssistant.voiceTriggerWithOneTextIngredient.TextField')));
sink('EmailDigest.sendDailyEmail', 'setMessage', 'Notes of the day ' + notes);
