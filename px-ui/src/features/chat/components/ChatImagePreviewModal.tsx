import { Carousel, CarouselProps } from "@mantine/carousel";
import { Box, Modal, ModalProps } from "@mantine/core";

type ChatImagePreviewModalProps = {
  images?: Array<{ url: string; name: string }>;
  modalProps: ModalProps;
  carouselProps?: CarouselProps;
};

const ChatImagePreviewModal = ({
  images = [],
  modalProps,
  carouselProps,
}: ChatImagePreviewModalProps) => {
  return (
    <Modal
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
      fullScreen
      {...modalProps}
    >
      <Box h="90vh" style={{ display: "flex" }}>
        <Carousel
          mx="auto"
          withIndicators={images.length > 1}
          withControls={images.length > 1}
          height="100%"
          style={{ flex: 1 }}
          {...carouselProps}
        >
          {images.map((i) => (
            <Carousel.Slide key={i.name}>
              <img
                src={i.url}
                alt={i.name}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    </Modal>
  );
};

export default ChatImagePreviewModal;
