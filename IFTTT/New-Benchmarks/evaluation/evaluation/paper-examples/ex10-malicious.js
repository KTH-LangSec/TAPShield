// Example 6.4

h = lbl(true);
if (h) {
	logo = urll("www.attacker.com");
	}
else {
	logo = urll("www.evil.com");
}
sink('Sink', '', logo);
