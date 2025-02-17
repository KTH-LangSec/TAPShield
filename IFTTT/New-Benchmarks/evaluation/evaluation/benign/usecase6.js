// https://gist.github.com/nullkal/ee160114ba4f0937c4ccbd800801708f
// 
// https://ifttt.com/applets/zVRwYKr4-mastodon-twitter


/*
 * mstdn2birdsite.ts - The filter code of "Mastodon → Twitter"
 * Written in 2017 by nullkal <nullkal@nil.nu>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright
 * and related and neighboring rights to this software to the public domain
 * worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along
 * with this software. If not, see
 * <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

type HandleFunc = (match: Array<string>) => string;

interface Handler {
  pattern: RegExp;
  func:    HandleFunc;
};

class FeedFilter {
  private handlers: Handler[];

  constructor() {
    this.handlers = [];
  }

  public addHandler(pattern: RegExp, func: HandleFunc) {
    this.handlers.push({ pattern, func });
  }

  public exec() {
    for (const i in this.handlers) {
      const handler = this.handlers[i];
      const match = handler.pattern.exec(Feed.newFeedItem.EntryTitle);
      if (match !== null) {
        Twitter.postNewTweet.setTweet(handler.func(match));
        return;
      }
    }
    Twitter.postNewTweet.skip();
  }
};

function formatContent(content: string) {
  return content
    .replace(/<br:\s*\/?>/g, "\n")
    .replace(/<.*?>/g, '')
    .replace(/((?:[^\w]|^)[@＠])(\w+)/g, '$1.$2');
}

let f = new FeedFilter();
f.addHandler(/^New status by /, (match) => {
  const content = formatContent(Feed.newFeedItem.EntryContent);
  const url = Feed.newFeedItem.EntryUrl;
  return `${content} ${url}`;
});
f.addHandler(
  /^\w+ shared a status by (\w+(?:@[a-z0-9\.\-]+[a-z0-9]+))/,
  (match) => {
    const originalPoster = Feed.newFeedItem.EntryUrl;
    const content = formatContent(Feed.newFeedItem.EntryContent);
    return `BT ${originalPoster}\n${content}`;
  }
);
f.exec();
