import React, { useEffect, useState } from 'react';
import { FieldAppSDK } from "@contentful/app-sdk";
import { Client } from '../models/client';
import { SubmitHandler, UseFormSetError, useForm } from "react-hook-form"
import { useSDK } from '@contentful/react-apps-toolkit';
import { CdaAsset } from '../models/cda-asset';

type ClientPageInput = {
    client: Client;
}

const useClientPageEditor = (): [
    SubmitHandler<ClientPageInput>,
    (client: Client) => void,
    Client[], 
    CdaAsset[]
] => {
    const sdk = useSDK<FieldAppSDK>();
    const [currClients, setCurrClients ] = useState<Client[]>([])
    const [images, setImages] = useState<CdaAsset[]>([])
    const newClient = {
        name: '',
        aboutUs: '',
        contactUs: '',
        logo: {
          id: '',
          mimeType: '',
          title: '',
          url: ''
        },
        faqs: []
      }

    useEffect(()=>{

        setCurrClients(sdk.field.getValue())

        sdk.cma.asset.getMany({}).then(data => {
          console.log(data.items)
          let filteredImgs: CdaAsset[] = data.items
            .filter(img => img.fields.file && img.fields.file["en-US"].contentType.includes('image'))
            .map(img => {
              return {
                id: img.sys.id,
                mimeType: img.fields.file["en-US"].contentType,
                title: img.fields.title["en-US"],
                url: img.fields.file["en-US"].url == undefined ? "" : 'https:'+img.fields.file["en-US"].url
              }
            })
          setImages(filteredImgs)
        })
        console.log(`Input client ${JSON.stringify(newClient)}`)
      }, [])

    const onAddClient : SubmitHandler<ClientPageInput> = (data) => {
        console.log(data)
        const logoStr = data.client.logo as unknown as string
        try{
            data.client.logo = JSON.parse(logoStr)
            currClients.push(data.client)
            setCurrClients(currClients)
            sdk.field.setValue(currClients)
        }catch{
            return false
        }
        
    }

    const onDeleteClient = (client: Client) => {
        console.log(`deleting client ${client.name}`)
        let updatedClients = currClients.filter((c) => c.name !== client.name)
        setCurrClients(updatedClients)
        sdk.field.setValue(updatedClients)
    }

    return [onAddClient, onDeleteClient, currClients, images]
}

export { useClientPageEditor };
export type { ClientPageInput };
