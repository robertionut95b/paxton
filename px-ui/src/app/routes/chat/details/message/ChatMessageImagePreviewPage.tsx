import { Routes } from "@app/routes";
import { APP_API_BASE_URL } from "@config/Properties";
import ChatImagePreviewModal from "@features/chat/components/ChatImagePreviewModal";
import { useGetMessageByUrlIdQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { updateQueryStringValueWithoutNavigation } from "@utils/routerUtils";
import { useCallback, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ChatMessageImagePreviewPage = () => {
  const [opened, setOpened] = useState(true);
  const { chatId, messageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchNameImg = searchParams.get("img");
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 600;

  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const { data: fileContents } = useGetMessageByUrlIdQuery(
    graphqlRequestClient,
    { urlId: messageId ?? "" },
    { select: (data) => data.getMessageByUrlId?.fileContents },
  );

  const images = fileContents
    ?.filter((i) => !i?.name.includes("-"))
    .map((i) => ({
      ...i,
      name: i?.name ?? "",
      url: `${APP_API_BASE_URL}/${i?.url}`,
    }));

  const currentImageIdxByParam = images?.findIndex(
    (i) => i.name === searchNameImg,
  );

  const closeModal = useCallback(() => {
    navigate(Routes.ChatInbox.Chat.Details.buildPath({ chatId: chatId ?? "" }));
    setOpened(false);
  }, [chatId, navigate]);

  const onImageSlide = useCallback(
    (index: number) => {
      const currentSlidedImage = images?.filter((_, idx) => idx === index)?.[0];
      const foundImage = images?.find((i) => i.id === currentSlidedImage?.id);
      if (foundImage) {
        updateQueryStringValueWithoutNavigation("img", foundImage.name);
      }
    },
    [images],
  );

  return (
    <ChatImagePreviewModal
      images={images}
      modalProps={{
        opened,
        onClose: closeModal,
        transitionDuration: TRANSITION_DURATION,
      }}
      carouselProps={{
        getEmblaApi: setEmbla,
        onSlideChange: onImageSlide,
        initialSlide: currentImageIdxByParam,
      }}
    />
  );
};

export default ChatMessageImagePreviewPage;
