import React, { useEffect, useReducer, useState } from 'react';
import { 
  Accordion, 
  AccordionHeader, 
  AccordionItem,Text, 
  DisplayText, 
  Paragraph, 
  Textarea,
  Heading,
  Button,
  TextInput,
  Form,
  FormControl,
  Select,
  AssetCard,
  TextLink} from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Client } from '../models/client';
import {ClientPageInput, useClientPageEditor} from '../hooks/useClientPageEditor';
import { useForm, useWatch } from 'react-hook-form';
import { AssetProps } from 'contentful-management';
import { CdaAsset } from '../models/cda-asset';
import { RichTextEditor } from '@contentful/field-editor-rich-text';
import * as Contentful from '@contentful/rich-text-types';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const [onAddClient, onDeleteClient, currClients, images] = useClientPageEditor()
  const {register ,handleSubmit,control,formState: { errors }}= useForm<ClientPageInput>()
  const [newClient, setNewClient] = useState<Client>({
    name: '',
    aboutUs: {
      nodeType: Contentful.BLOCKS.DOCUMENT,
      content: [],
      data: {}
    },
    contactUs: {
      nodeType: Contentful.BLOCKS.DOCUMENT,
      content: [],
      data: {}
    },
    logo: {
      id: '',
      mimeType: '',
      title: '',
      url: ''
    },
    faqs: []
  })

  useEffect(()=>{
    console.log(`current Clients ${currClients}`)
  }, [currClients])

  sdk.window.startAutoResizer()

  // if(!sdk.field.getValue()){
  //   sdk.field.setValue(initClientList)
  // }

  // console.log(sdk.field.getValue());

  return (
    <div>
      <Paragraph>Hello FFA Client Page Editor (AppId: {sdk.ids.app})</Paragraph>
      <Accordion>
        {currClients.map(c => (
          <AccordionItem key={c.name}  title={c.name}>
            <Text>Logo: <TextLink href={c.logo.url} target="_blank" rel="noopener noreferrer">{c.logo.title}</TextLink></Text>
            <Heading as="h3">About Us</Heading>
            <RichTextEditor sdk={sdk} value={c.aboutUs} isInitiallyDisabled></RichTextEditor> 
            <Button onClick={()=>setNewClient(c)}>Edit</Button><Button onClick={()=>onDeleteClient(c)}>Remove</Button>
          </AccordionItem>  
        ))}
      </Accordion>
      <Form onSubmit={handleSubmit(onAddClient)}>
        {/* Name */}
        <FormControl isInvalid={Boolean(errors.client?.name)}>
        <FormControl.Label isRequired>Name</FormControl.Label>
          {/* Use the register function from react-hook-form on TextInput */}
          <TextInput
            value={newClient.name} 
            {...register('client.name', 
              { 
                required: true, 
                validate: (name) => !currClients.some(c => c.name == name)
              } 
            )}
            onChange={(e) => setNewClient({...newClient, name: e.target.value})}
            />

          {/* Show a ValidationMessage if the input has any errors */}
          {errors.client?.name && (
            <FormControl.ValidationMessage>
              Client {newClient.name} already exists. Please edit or remove existing client
            </FormControl.ValidationMessage>
          )}
        </FormControl>
        {/* Logo */}
        <FormControl isInvalid={Boolean(errors.client?.logo)}>
        <FormControl.Label isRequired>Logo</FormControl.Label>
          {/* Use the register function from react-hook-form on TextInput */}
          {/* <Asset></MultipleMediaEditor> */}
          <Select 
            value={JSON.stringify(newClient.logo)}
            {...register('client.logo', 
              {
                required: true,
                validate: (logo) => {
                  const logoStr = logo as unknown as string
                  try{
                    let logoObj = JSON.parse(logoStr)
                    return logoObj.title !== undefined && logoObj.title !== ''
                  }catch{
                    return false
                  }
                  
                }
              }
            )}
            onChange={(e) => { 
              let logoReset: CdaAsset = {
                id: '',
                mimeType: '',
                title: '',
                url: ''
              } 
              try {
                const parsed = JSON.parse(e.target.value)
                if (parsed && typeof parsed === "object") {
                  setNewClient({...newClient, logo: JSON.parse(e.target.value)})
                }
                else {
                  setNewClient({...newClient, logo: logoReset})
                }
              } catch { 
                  setNewClient({...newClient, logo: logoReset})
               }
            }}
            defaultValue=''
          >
            <Select.Option key='' value={undefined}>No Selection</Select.Option>
            {images.map(c => (
              <Select.Option key={c.title} value={JSON.stringify(c)}>{c.title}</Select.Option>
            ))}
          </Select>

          {/* Show a ValidationMessage if the input has any errors */}
          {errors.client?.logo && (
            <FormControl.ValidationMessage>
              Please select a logo from the drop down
            </FormControl.ValidationMessage>
          )}
        </FormControl>
        {/* Logo Image */}
        <FormControl>
          <AssetCard
              type='image'
              title={newClient.logo.title}
              src={newClient.logo.url}
              size='small'
            >
          </AssetCard>
        </FormControl>
        {/* About Us */}
        <FormControl isInvalid={Boolean(errors.client?.aboutUs)}>
        <FormControl.Label isRequired>About Us</FormControl.Label>
          {/* Use the register function from react-hook-form on TextInput */}
          <RichTextEditor
            sdk={sdk}
            isInitiallyDisabled={false}
            value={newClient.aboutUs} 
            {...register('client.aboutUs', 
              { 
                required: true, 
                //validate: (about) => about.length > 0
              } 
            )}
            onChange={(e) => setNewClient({...newClient, aboutUs: e})}
            />

          {/* Show a ValidationMessage if the input has any errors */}
          {errors.client?.name && (
            <FormControl.ValidationMessage>
              Client {newClient.name} already exists. Please edit or remove existing client
            </FormControl.ValidationMessage>
          )}
        </FormControl>
        <Button variant="primary" type="submit">Add</Button>
      </Form>
    </div>
  );
};
 
export default Field;
