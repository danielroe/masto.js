import type {
  Account,
  Application,
  Attachment,
  Card,
  Emoji,
  FilterResult,
  Mention,
  Poll,
  Tag,
} from '.';

export type StatusVisibility = 'public' | 'unlisted' | 'private' | 'direct';

/**
 * Represents a status posted by an account.
 * @see https://docs.joinmastodon.org/entities/status/
 */
export interface Status {
  /** ID of the status in the database. */
  id: string;
  /** URI of the status used for federation. */
  uri: string;
  /** The date when this status was created. */
  createdAt: string;
  /** Timestamp of when the status was last edited. */
  editedAt: string | null;
  /** The account that authored this status. */
  account: Account;
  /** HTML-encoded status content. */
  content: string;
  /** Visibility of this status. */
  visibility: StatusVisibility;
  /** Is this status marked as sensitive content? */
  sensitive: boolean;
  /** Subject or summary line, below which status content is collapsed until expanded. */
  spoilerText: string;
  /** Media that is attached to this status. */
  mediaAttachments: Attachment[];
  /** The application used to post this status. */
  application: Application;

  /** Mentions of users within the status content. */
  mentions: Mention[];
  /** Hashtags used within the status content. */
  tags: Tag[];
  /** Custom emoji to be used when rendering status content. */
  emojis: Emoji[];

  /** How many boosts this status has received. */
  reblogsCount: number;
  /** How many favourites this status has received. */
  favouritesCount: number;
  /** If the current token has an authorized user: The filter and keywords that matched this status. */
  filtered?: FilterResult[];
  /** How many replies this status has received. */
  repliesCount: number;

  /** A link to the status's HTML representation. */
  url?: string | null;
  /** ID of the status being replied. */
  inReplyToId?: string | null;
  /** ID of the account being replied to. */
  inReplyToAccountId?: string | null;
  /** The status being reblogged. */
  reblog?: Status | null;
  /** The poll attached to the status. */
  poll?: Poll | null;
  /** Preview card for links included within status content. */
  card?: Card | null;
  /** Primary language of this status. */
  language?: string | null;
  /**
   * Plain-text source of a status. Returned instead of `content` when status is deleted,
   * so the user may redraft from the source text without the client having
   * to reverse-engineer the original text from the HTML content.
   */
  text?: string | null;

  /** Have you favourited this status? */
  favourited?: boolean | null;
  /** Have you boosted this status? */
  reblogged?: boolean | null;
  /** Have you muted notifications for this status's conversation? */
  muted?: boolean | null;
  /** Have you bookmarked this status? */
  bookmarked?: boolean | null;
  /** Have you pinned this status? Only appears if the status is pin-able. */
  pinned?: boolean | null;
}
