import Script from 'next/script'

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "FlashFundX Trading Academy",
    "alternateName": "FlashFundX",
    "url": "https://flashfundx.com",
    "logo": "https://flashfundx.com/logo-800-4.svg",
    "description": "Advanced trading education platform with prop trading simulation, skill assessment, and comprehensive trader development programs",
    "educationalCredentialAwarded": "Trading Skill Certification",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Prop Trading Skill Certificate",
      "description": "Certification for completing advanced prop trading skill development program"
    },
    "offers": [
      {
        "@type": "Course",
        "name": "Instant Trading Simulation Program",
        "description": "Immediate access to trading simulation with no skill assessment period",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "FlashFundX Trading Academy"
        },
        "educationalLevel": "Beginner to Advanced",
        "teaches": "Trading simulation, risk management, market analysis"
      },
      {
        "@type": "Course", 
        "name": "Advanced Trading Skills Program",
        "description": "High-frequency trading education with ultra-low latency simulation",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "FlashFundX Trading Academy"
        },
        "educationalLevel": "Advanced",
        "teaches": "High-frequency trading, advanced order types, institutional simulation"
      },
      {
        "@type": "Course",
        "name": "1-Step Skill Assessment Program", 
        "description": "Single phase skill development program with competitive pricing",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "FlashFundX Trading Academy"
        },
        "educationalLevel": "Intermediate",
        "teaches": "Trading skill assessment, performance evaluation, risk management"
      },
      {
        "@type": "Course",
        "name": "2-Step Skill Development Program",
        "description": "Traditional skill development program with highest training reward splits", 
        "provider": {
          "@type": "EducationalOrganization",
          "name": "FlashFundX Trading Academy"
        },
        "educationalLevel": "Beginner to Intermediate",
        "teaches": "Progressive skill development, two-phase learning, comprehensive training"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-FLASHFX",
      "contactType": "Educational Support",
      "availableLanguage": ["English"],
      "hoursAvailable": "24/7"
    },
    "sameAs": [
      "https://twitter.com/FlashFundX",
      "https://linkedin.com/company/flashfundx",
      "https://discord.gg/flashfundx"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FlashFundX Trading Academy",
    "url": "https://flashfundx.com",
    "description": "Advanced trading education platform with prop trading simulation, skill assessment, and comprehensive trader development programs",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "FlashFundX Trading Academy"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flashfundx.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://flashfundx.com"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Trading Education Programs",
        "item": "https://flashfundx.com/#pricing"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Learning Resources",
        "item": "https://flashfundx.com/#faq"
      }
    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
