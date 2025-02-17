# Benchmarks

The benchmark set contains 60 applets, 30 secure and 30 insecure, with a secure
and insecure version for each applet scenario. The applets are named accordingly, 
i.e. the secure ones end in `_benign.js`, whereas the insecure ones end in 
`_malicious.js`.

The security policy we evaluate them on is confidentiality of user data originating
from the trigger. Some of the applets are considered to be presence-sensitive, 
and are marked accordingly.

Each file specifies the user data to be covered by the security policy and whether 
the applet is presence-sensitive or not. `forum_examples_7_malicious.js` has the 
following security policy:
`Policy/Presence: Confidentiality of user photos / No`


# Execution with FlowIT

Benchmarks with the presence set to `No` will be executed as any other JavaScript 
file, with the monitor enforcing information flow control. For example, the code 
in file `paper_examples_ex6.1_benign.js` will be run as:
`./jsflow paper_examples_ex6.1_benign.js`

Benchmarks with the presence set to `Yes` will be executed with flag `-sensitive`,
with no information flow control to be enforced. For example, the code in file
`popular3rdparty_9_malicious.js` will be run as:
`./jsflow -sensitive popular3rdparty_9_malicious.js`
In order to ensure no information flow restrictions, no labels should be used in
the code marked as presence-sensitive.


# Contributors

* Iulia Bastys
* Musard Balliu
* Andrei Sabelfeld
