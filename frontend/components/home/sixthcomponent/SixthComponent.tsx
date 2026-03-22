import Container from '@/components/global/container';
import Image from 'next/image';

export default function SixthComponent() {
    return (
        <Container>
            <section className="pt-40 pb-40">
                <div className="flex items-center text-center justify-center">
                    <div className="space-y-6">
                        <div>
                            <div>
                                <h1 className="text-4xl font-bold text-[#6C2D40] mt-2">Pay with Ease Your Safety Comes First</h1>
                            </div>
                            <p className="text-gray-700 text-lg">We gladly accept credit card payments, which are securely processed offline for your protection.</p>
                        </div>
                        <div className="flex flex-row gap-5 justify-center">
                            <Image priority src="/assets/round.png" alt="logo" width={50} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} />
                            <Image priority src="/assets/visa.png" alt="logo" width={50} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} />
                            <Image priority src="/assets/american-express.png" alt="logo" width={50} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} />
                            <Image priority src="/assets/jcb.png" alt="logo" width={50} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} />
                            <Image priority src="/assets/diners-club.png" alt="logo" width={50} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} />
                        </div>
                    </div>
                </div>
            </section>
        </Container>
    );
}
