export const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    form.append("pinataMetadata", JSON.stringify({ name: file.name }));
    form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    const options = {
        body: form,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_PINATA_JWT,
        }
    };
    options.body = form

    const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        options
    );
    const resData = await res.json();
    return (process.env.NEXT_PUBLIC_PINATA_GATEWAY + resData.IpfsHash);
}

export const uploadJson = async (jsonData: any) => {
    console.log(`{"pinataOptions":{"cidVersion":1},"pinataMetadata":{"name":"metadata${new Date().valueOf()}.json"},"pinataContent":${JSON.stringify(jsonData)}}`)
    const options = {
        body: `{"pinataOptions":{"cidVersion":1},"pinataMetadata":{"name":"metadata${new Date().valueOf()}.json"},"pinataContent":${JSON.stringify(jsonData)}}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_PINATA_JWT,
          'Content-Type': 'application/json'
        }
    };
    const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        options
    );
    const resData = await res.json();
    return (process.env.NEXT_PUBLIC_PINATA_GATEWAY + resData.IpfsHash);
}

export const createNFTMetadata = async (name: string ,cover: File, mp3File: File, transcripts: File, onComplete: any) => {
    const coverLink = await uploadFile(cover)
    const audioLink = await uploadFile(mp3File)
    const transcriptsLink = await uploadFile(transcripts)

    const jsonLink = await uploadJson({
        "audio": audioLink,
        "transcripts": transcriptsLink
    })

    const metadataLink = await uploadJson({
        "name": name,
        "description": name,
        "image": coverLink,
        "external_url": jsonLink
    })
    console.log(metadataLink)
    await onComplete(metadataLink)

}