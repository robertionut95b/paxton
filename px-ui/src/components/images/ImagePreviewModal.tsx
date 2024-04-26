import { Carousel, CarouselProps } from "@mantine/carousel";
import { Box, Image, Modal, ModalProps } from "@mantine/core";

type ImagePreviewModalProps = {
  images?: Array<{ url: string; name: string }>;
  modalProps: ModalProps;
  carouselProps?: CarouselProps;
};

const ImagePreviewModal = ({
  images = [],
  modalProps,
  carouselProps,
}: ImagePreviewModalProps) => {
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
          withIndicators
          height="100%"
          style={{ flex: 1 }}
          {...carouselProps}
        >
          {images.map((i) => (
            <Carousel.Slide key={i.name}>
              <Image src={i.url} alt={i.name} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;
