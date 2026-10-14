import { createFileRoute } from '@tanstack/react-router';
import { SiteShell } from '@/components/site/site-shell';
import { PageIntro, AboutSection, Principles, CtaBand } from '@/components/site/sections';
import { pageHead } from '@/lib/site-data';
export const Route = createFileRoute('/a-doutora')({head:()=>pageHead('A doutora','Conheça a Dra. Rebeca Galdino, cirurgiã-dentista em Piracaia, e os princípios de um cuidado atento e individualizado.'),component:Doctor});
function Doctor(){return <SiteShell><PageIntro eyebrow="A doutora" title="Presença no atendimento. Cuidado em cada detalhe." description="Dra. Rebeca Galdino · Cirurgiã-dentista em Piracaia — SP."/><AboutSection full/><Principles/><CtaBand/></SiteShell>;}
