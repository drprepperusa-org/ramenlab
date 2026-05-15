import { useDialog } from '../../hooks/useDialog';
import ReserveDialog from './ReserveDialog';
import BuildBowlDialog from './BuildBowlDialog';
import GiftCardDialog from './GiftCardDialog';

/**
 * Mount once at the app root. Listens to the dialog event bus and renders
 * whichever flow is currently active. Each dialog is keyed so its internal
 * step state resets every time it reopens.
 */
export default function DialogHost() {
  const { active } = useDialog();

  return (
    <>
      <ReserveDialog key={active === 'reserve' ? 'reserve-open' : 'reserve-closed'} open={active === 'reserve'} />
      <BuildBowlDialog key={active === 'build' ? 'build-open' : 'build-closed'} open={active === 'build'} />
      <GiftCardDialog key={active === 'gift' ? 'gift-open' : 'gift-closed'} open={active === 'gift'} />
    </>
  );
}
