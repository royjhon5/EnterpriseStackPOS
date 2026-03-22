import Container from '@/components/global/container';
import Image from 'next/image';

export default function ThirdComponent() {
    return (
        <Container>
            <section className="pt-40 pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative grid grid-cols-1 grid-cols-2 w-full">
                        <div>
                            <Image priority src="/assets/diningcafe.png" alt="logo" width={400} height={400} style={{ width: 'auto', height: 'auto' }} quality={100} />
                        </div>
                        <div>
                            <Image priority src="/assets/diningcafe.png" alt="logo" width={400} height={400} style={{ width: 'auto', height: 'auto' }} quality={100} />
                        </div>
                        <div>
                            <Image priority src="/assets/diningcafe.png" alt="logo" width={400} height={400} style={{ width: 'auto', height: 'auto' }} quality={100} />
                        </div>
                        <div>
                            <Image priority src="/assets/diningcafe.png" alt="logo" width={400} height={400} style={{ width: 'auto', height: 'auto' }} quality={100} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#6C2D40] mt-2">Our Rooms</h1>
                        </div>
                        <p className="text-gray-700 text-lg">Step into spacious, well-appointed rooms crafted for your comfort.</p>
                        <p className="text-justify">
                            Choose from our Standard, Deluxe, Super Deluxe, and Suite Rooms, each designed with timeless interiors, cozy beds, and essential modern amenities perfect for both solo
                            travelers and families.
                        </p>
                        <div>
                            <p className="text-[#6C2D40]">Amenities include: </p>
                            <p>Complimentary Wi-Fi, 24-hour room service, air conditioning, cable TV, hot & cold shower, and more.</p>
                        </div>
                        <div>
                            <button className="btn btn-primary">Book Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </Container>
    );
}
