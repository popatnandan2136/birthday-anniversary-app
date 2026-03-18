import React from 'react';
import * as BirthdayTemplates from '../templates/birthday/index.jsx';
import * as AnniversaryTemplates from '../templates/anniversary/index.jsx';

export const TemplateDispatcher = ({ type, templateId, wishData }) => {
  let Component = null;

  if (type === 'birthday') {
    // Convert template ID to component name
    const componentName = templateId
      .split('-')
      .map((part, idx) => {
        if (idx === 0) return part.charAt(0).toUpperCase() + part.slice(1);
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join('');

    const finalName = componentName.replace(/([A-Z])/g, (match) => match).replace(/-/g, '') + 'Template';
    
    // Try to find the component
    const templates = Object.keys(BirthdayTemplates);
    const found = templates.find((t) => t.toLowerCase().includes(templateId.replace(/-/g, '')));
    
    if (found) {
      Component = BirthdayTemplates[found];
    } else {
      // Fallback to first available template
      Component = BirthdayTemplates.DefaultBirthdayTemplate;
    }
  } else if (type === 'anniversary') {
    const componentName = templateId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const templates = Object.keys(AnniversaryTemplates);
    const found = templates.find((t) => t.toLowerCase().includes(templateId.replace(/-/g, '')));
    
    if (found) {
      Component = AnniversaryTemplates[found];
    } else {
      Component = AnniversaryTemplates.DefaultAnniversaryTemplate;
    }
  }

  if (!Component) {
    return (
      <div className="flex-center min-h-screen">
        <p className="text-gray-600">Template not found</p>
      </div>
    );
  }

  return <Component {...wishData} />;
};

export default TemplateDispatcher;
