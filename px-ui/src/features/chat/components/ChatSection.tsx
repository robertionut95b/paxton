import { APP_API_BASE_URL } from "@config/Properties";
import MessageLine from "@features/chat/components/MessageLine";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetMessagesPaginatedQuery } from "@gql/generated";
import { User } from "@interfaces/user";
import { Divider, ScrollArea, Stack } from "@mantine/core";
import { displayInitials } from "@utils/initials";
import { format } from "date-fns";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

type ChatSectionProps = {
  messages: NonNullable<
    NonNullable<
      NonNullable<GetMessagesPaginatedQuery["getMessagesPaginated"]>["list"]
    >
  >;
  currentUser: User | null;
  height?: string | number;
  autoScroll?: boolean;
  childrenPre?: React.ReactNode;
  childrenPost?: React.ReactNode;
};

const ChatSection = ({
  messages,
  currentUser,
  height = "50vh",
  autoScroll = true,
  childrenPre,
  childrenPost,
}: ChatSectionProps) => {
  const viewport = useRef<HTMLDivElement>(null);
  const [parent] = useAutoAnimate();
  const { pathname } = useLocation();
  const isCurrentSender = (message: (typeof messages)[number]) =>
    String(message?.sender.id) === String(currentUser?.userId);

  useEffect(() => {
    if (viewport.current && pathname) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (viewport.current && autoScroll) {
      const { offsetHeight, scrollHeight, scrollTop } = viewport.current;
      if (scrollHeight <= scrollTop + offsetHeight + 100) {
        viewport.current.scrollTo({
          top: viewport.current.scrollHeight,
        });
      }
    }
  }, [messages, autoScroll]);

  const chronoMsgs = useMemo(
    () =>
      compose(
        groupBy((m) =>
          format(
            // @ts-expect-error(lodash-types)
            new Date(m?.deliveredAt),
            new Date().getFullYear() !==
              // @ts-expect-error(lodash-types)
              new Date(m?.deliveredAt).getFullYear()
              ? "dd MMMM yyyy"
              : "dd MMMM",
          ),
        ),
      )(messages),
    [messages],
  );

  return (
    <ScrollArea
      h={height}
      className="px-chat-wrapper"
      scrollbarSize={6}
      viewportRef={viewport}
    >
      {childrenPre}
      {Object.entries(chronoMsgs).map(([key, value]) => (
        <Stack key={key} spacing={"sm"} mt="xs" ref={parent}>
          <Divider
            label={key}
            labelPosition="center"
            className="font-semibold uppercase text-gray-400"
          />
          {(value as typeof messages).map(
            (m) =>
              m && (
                <div key={m.id}>
                  <MessageLine
                    urlId={m.urlId}
                    avatar={
                      m.sender.userProfile.userProfileAvatarImage &&
                      `${APP_API_BASE_URL}/${m.sender.userProfile?.userProfileAvatarImage?.url}`
                    }
                    avatarInitials={displayInitials(
                      m.sender.username,
                      m.sender.firstName,
                      m.sender.lastName,
                    )}
                    name={m.sender.firstName}
                    content={m?.content}
                    position={isCurrentSender(m) ? "right" : "left"}
                    sentAt={m.deliveredAt}
                    fileContents={m?.fileContents ?? []}
                  />
                </div>
              ),
          )}
        </Stack>
      ))}
      {childrenPost}
    </ScrollArea>
  );
};

export default ChatSection;
