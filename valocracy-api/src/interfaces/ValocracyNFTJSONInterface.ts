interface NFTAttributeInterface {
    trait_type: string,
    value: number | string
}

interface ValocracyNFTJSONInterface {
    id: string,
    name: string,
    description?: string,
    image: string,
    attributes: Array<NFTAttributeInterface>
}

export default ValocracyNFTJSONInterface;