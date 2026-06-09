"use client";

import React, { useState } from 'react';
import styles from './Community.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle';
import { CommunityHeader } from './CommunityHeader/CommunityHeader';
import { CommunityFilters } from './CommunityFilters/CommunityFilters';
import { CommunityEventsList } from './CommunityEventsList/CommunityEventsList';
import { CommunityEvent } from '../../../../types/community';

interface CommunityProps {
  lang: string;
}

const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "evt-1",
    title: "Business Innovation Summit 2026",
    speaker: { id: "spk-1", name: "Andrew Nikolov" },
    description: "Connect with 500+ industry trailblazers at the Business Innovation Summit 2026. Explore AI, navigate digital transformation, and unlock strategic growth opportunities. Elevate your expertise and expand your network.",
    date: "2026-08-20T10:00:00Z",
    displayDate: "Thursday, 20 Aug",
    location: "LIVE, Sofia",
    imageSrc: "/images/community/summit_event.png",
    tags: ["recommended", "business", "on_site"]
  },
  {
    id: "evt-2",
    title: "Future of Finance Forum",
    speaker: { id: "spk-2", name: "Sarah Jenkins" },
    description: "Discover the latest trends in fintech, decentralized finance, and banking innovations. Join top executives and visionaries to discuss what the next decade holds for the financial sector.",
    date: "2026-08-23T09:00:00Z",
    displayDate: "Sunday, 23 Aug",
    location: "ONLINE",
    imageSrc: "/images/community/finance_event.png",
    tags: ["recommended", "business", "online"]
  },
  {
    id: "evt-3",
    title: "Tech Leadership Workshop",
    speaker: { id: "spk-3", name: "David Chen" },
    description: "An intensive half-day workshop for emerging tech leaders. Learn how to build resilient teams, manage technical debt, and drive innovation within your organization.",
    date: "2026-08-25T14:00:00Z",
    displayDate: "Tuesday, 25 Aug",
    location: "LIVE, Sofia",
    imageSrc: "/images/community/tech_event.png",
    tags: ["recommended", "top_speakers", "on_site"]
  },
  {
    id: "evt-4",
    title: "Past AI Conference",
    speaker: { id: "spk-4", name: "Elena Rostova" },
    description: "This is a past event and should not be displayed in the list of upcoming events.",
    date: "2023-01-01T10:00:00Z",
    displayDate: "Monday, 1 Jan",
    location: "ONLINE",
    imageSrc: "/images/community/ai_event.png",
    tags: ["recommended", "ai", "online"]
  },
  {
    id: "evt-5",
    title: "Startup Pitch Night",
    speaker: { id: "spk-5", name: "Michael Chang" },
    description: "Watch early-stage startups pitch their innovative ideas to top venture capitalists.",
    date: "2026-09-10T18:00:00Z",
    displayDate: "Thursday, 10 Sep",
    location: "LIVE, London",
    imageSrc: "/images/community/summit.png",
    tags: ["business", "on_site"]
  },
  {
    id: "evt-6",
    title: "Web3 & Blockchain Summit",
    speaker: { id: "spk-6", name: "Sophia Martinez" },
    description: "Explore the future of decentralized internet and blockchain applications with industry leaders.",
    date: "2026-09-15T10:00:00Z",
    displayDate: "Tuesday, 15 Sep",
    location: "ONLINE",
    imageSrc: "/images/community/ai_event.png",
    tags: ["business", "online"]
  },
  {
    id: "evt-7",
    title: "Design Systems Masterclass",
    speaker: { id: "spk-7", name: "Alex Rivera" },
    description: "A deep dive into creating scalable and maintainable design systems for enterprise applications.",
    date: "2026-09-20T14:00:00Z",
    displayDate: "Sunday, 20 Sep",
    location: "LIVE, Berlin",
    imageSrc: "/images/community/summit.png",
    tags: ["business", "on_site"]
  }
];

export const Community: React.FC<CommunityProps> = ({ lang }) => {
  const [activeTag, setActiveTag] = useState<string>('recommended');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -400, behavior: 'smooth' });
  };

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 400, behavior: 'smooth' });
  };

  const now = new Date();

  // Filter events: only upcoming AND matching the active tag
  const filteredEvents = MOCK_EVENTS.filter(event => {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= now;
    const hasTag = event.tags.includes(activeTag);
    return isUpcoming && hasTag;
  });

  return (
    <section className={styles.communitySection}>
      <div className={styles.communityContainer}>
        <SectionTitle title="Business Community & Gatherings" />
        
        <div className={styles.mainContentRow}>
          <div className={styles.eventsColumn}>
            <CommunityHeader lang={lang} onScrollUp={scrollUp} onScrollDown={scrollDown} />
            
            <div className={styles.filtersAndEventsRow}>
              <CommunityFilters activeTag={activeTag} onTagChange={setActiveTag} />
              
              <CommunityEventsList events={filteredEvents} lang={lang} scrollRef={scrollRef} />
            </div>
          </div>
          
          <div className={styles.sidebarColumn}>
            <div className={styles.sidebarPlaceholder}></div>
          </div>
        </div>
      </div>
    </section>
  );
};
