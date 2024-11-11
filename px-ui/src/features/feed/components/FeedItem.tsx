type FeedItemProps = {
  type: string;
};

const FeedItem = ({ type }: FeedItemProps) => {
  return <div>FeedItem of type {type}</div>;
};

export default FeedItem;
