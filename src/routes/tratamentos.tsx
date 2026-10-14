import { createFileRoute, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/tratamentos')({component:TreatmentLayout});
function TreatmentLayout(){return <Outlet/>;}
