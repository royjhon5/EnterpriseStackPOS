import Container from '@/components/global/container';
import Image from 'next/image';

export default function FifthComponent() {
    return (
        <Container>
            <section className="pt-40 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#6C2D40] mt-2">Events & Functions</h1>
                        </div>
                        <p className="text-gray-700 text-lg">Host your meetings, parties, or conferences in style.</p>
                        <p className="text-justify">
                            Our function rooms can accommodate intimate gatherings or large events of up to 200 guests, complete with catering services, audio-visual equipment, and professional event
                            support.
                        </p>
                        <div></div>
                    </div>

                    <div className="relative h-[400px] w-full">
                        <Image priority src="/assets/diningcafe.png" alt="logo" width={400} height={400} style={{ width: 'auto', height: 'auto' }} quality={100} />
                    </div>
                </div>
            </section>
        </Container>
    );
}
