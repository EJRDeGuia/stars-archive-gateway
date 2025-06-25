
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I access thesis documents?",
      answer: "To access full thesis documents, you need to be logged in with your DLSL credentials and connected to the campus network. Preview pages are available to all users. Contact the LRC if you need assistance."
    },
    {
      question: "Can I download thesis documents?",
      answer: "Full document access is restricted to protect intellectual property. You can view documents online and contact the LRC directly for specific access requests."
    },
    {
      question: "How do I search for specific theses?",
      answer: "Use the search bar with keywords related to your topic. You can search by title, author, keywords, or college. Use quotation marks for exact phrases and apply filters to narrow your results."
    },
    {
      question: "What file formats are supported?",
      answer: "STARS primarily supports PDF documents. All thesis documents are converted to PDF format for consistent viewing and security."
    },
    {
      question: "How do I create collections?",
      answer: "Log in to your account, find theses you want to save, and use the 'Save to Library' function. You can then organize these into custom collections from your dashboard."
    },
    {
      question: "Who can upload theses to STARS?",
      answer: "Only authorized archivists and LRC staff can upload thesis documents to maintain quality and authenticity of the archive."
    },
    {
      question: "How do I cite a thesis from STARS?",
      answer: "Each thesis page includes citation information. Click the 'Cite This Work' button to get properly formatted citations in APA style."
    },
    {
      question: "Is there a mobile app for STARS?",
      answer: "STARS is a web-based platform optimized for mobile browsers. Simply access the website from your mobile device for the best experience."
    },
    {
      question: "How often is the database updated?",
      answer: "The STARS database is updated regularly as new theses are submitted and processed by the LRC. New content is typically added weekly."
    },
    {
      question: "Can external researchers access STARS?",
      answer: "Access is primarily for DLSL community members. External researchers should contact the LRC directly to inquire about special access arrangements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">Find answers to common questions about STARS</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-6 w-6" />
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
            <p className="text-blue-800 mb-4">
              If you can't find the answer you're looking for, please contact the Learning Resource Center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:lrc@dlsl.edu.ph">Email Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+6343123456">Call Support</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
