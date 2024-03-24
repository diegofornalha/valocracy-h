import { Box, SkeletonText } from "@chakra-ui/react";

export const NftSkeleton = ({ isLoaded }) => {
  return (
    <Box padding="6" boxShadow="lg" bg="transparent">
      <SkeletonText
        isLoaded={isLoaded}
        mt="4"
        noOfLines={4}
        spacing="4"
        skeletonHeight="2"
      />
    </Box>
  );
};
