import * as Contentful from '@contentful/rich-text-types';

export interface ClientFAQ {
    question: Contentful.Document;
    answer: Contentful.Document;
} 