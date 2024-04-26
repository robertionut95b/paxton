import ImagePreviewModal from "@components/images/ImagePreviewModal";
import { API_PAGINATION_SIZE, APP_API_BASE_URL } from "@constants/Properties";
import {
  FieldType,
  Operator,
  SortDirection,
  useInfiniteGetMessagesPaginatedQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { updateQueryStringValueWithoutNavigation } from "@utils/routerUtils";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const MessageImagePreviewPage = () => {
  const [opened, setOpened] = useState(true);
  const { chatId, messageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchMsgField = searchParams.get("m");
  const searchNameImg = searchParams.get("img");
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 600;

  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const searchQuery = useMemo(
    () => ({
      filters: [
        {
          key: "chat.urlId",
          value: chatId as string,
          operator: Operator.Equal,
          fieldType: FieldType.String,
        },
        ...(searchMsgField
          ? [
              {
                key: "content",
                value: searchMsgField ?? "",
                operator: Operator.Like,
                fieldType: FieldType.Char,
              },
            ]
          : []),
      ],
      sorts: [
        {
          direction: SortDirection.Desc,
          key: "id",
        },
      ],
      page: 0,
      size: API_PAGINATION_SIZE,
    }),
    [chatId, searchMsgField],
  );

  const { data: messagesData } = useInfiniteGetMessagesPaginatedQuery(
    graphqlRequestClient,
    {
      searchQuery,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const offset: number = (allPages.length ?? 1) * API_PAGINATION_SIZE;
        const totalItems = lastPage.getMessagesPaginated?.totalElements ?? 0;
        const currPage = (lastPage.getMessagesPaginated?.page ?? 0) + 1;
        if (offset < totalItems)
          return {
            searchQuery: {
              ...searchQuery,
              page: currPage,
            },
          };
      },
      suspense: true,
    },
  );

  const currentMessage = messagesData?.pages
    .filter((p) =>
      p.getMessagesPaginated?.list?.filter((m) => m?.urlId === messageId),
    )?.[0]
    .getMessagesPaginated?.list?.filter((mp) => mp?.urlId === messageId)?.[0];

  const images = currentMessage?.fileContents
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
    navigate(`/app/inbox/messages/chat/${chatId}`);
    setOpened(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <ImagePreviewModal
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

export default MessageImagePreviewPage;
