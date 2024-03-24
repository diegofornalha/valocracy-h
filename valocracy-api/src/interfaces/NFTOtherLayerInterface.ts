import { NFTImageFormatTypeEnum } from '@/enums/NFTImageFormatTypeEnum';
import { NFTLayerTypeEnum } from '@/enums/NFTLayerTypeEnum';

interface LayerOptionsInterface {
    width: number | null | undefined,
    heigth: number | null | undefined,
    top: number | undefined,
    left: number | undefined
}

interface NFTOtherLayerInterface {
    image: string,
    image_format: NFTImageFormatTypeEnum,
    image_layer: NFTLayerTypeEnum,
    layer_options?: LayerOptionsInterface
}

export default NFTOtherLayerInterface;