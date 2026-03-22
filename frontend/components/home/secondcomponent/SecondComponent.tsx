import Container from '@/components/global/container';
import Image from 'next/image';

export default function SecondComponent() {
    return (
        <Container>
            <section className="pt-40 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#6C2D40] mt-2">Your Home in the Heart of Cagayan de Oro</h1>
                        </div>
                        <p className="text-gray-700 text-lg">Experience Comfort, Elegance, and True Kagay-anon Hospitality.</p>
                        <p className="text-justify">
                            At Maxandrea Hotel, we believe that every guest deserves a relaxing stay that feels just like home with the convenience and class of a premier city hotel. Whether you’re
                            here for business, leisure, or a special occasion, our friendly staff and thoughtfully designed spaces ensure a stay that’s both comfortable and memorable.
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
