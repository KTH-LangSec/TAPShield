// Example 6.5

l = true;
url = urll("www.attacker.com");
sink('Sink', '', url);
if (l) {
	skip('Sink');
}


