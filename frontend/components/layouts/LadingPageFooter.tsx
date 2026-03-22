import IconFacebook from '@/components/icon/icon-facebook';
import IconInstagram from '@/components/icon/icon-instagram';
import IconPhone from '@/components/icon/icon-phone';
import IconSend from '@/components/icon/icon-send';
import IconTwitter from '@/components/icon/icon-twitter';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPageFooter() {
    return (
        <div className="p-20 flex justify-center items-center">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-40">
                <div className="flex flex-col gap-3">
                    <Image priority src="/assets/logonobg.png" alt="logo" width={160} height={50} style={{ width: 'auto', height: 'auto' }} quality={100} />
                    <h1 className="text-justify text-md">Located at the corner of J.R. Borja and Aguinaldo Streets, Maxandrea Hotel places you right at the heart of Cagayan de Oro City </h1>
                    <div className="flex flex-row gap-2">
                        <div className="p-2 bg-white rounded-full shadow-lg">
                            <IconFacebook className="h-5 w-5" />
                        </div>
                        <div className="p-2 bg-white rounded-full shadow-lg">
                            <IconTwitter className="h-5 w-5" />
                        </div>
                        <div className="p-2 bg-white rounded-full shadow-lg">
                            <IconInstagram className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="text-2xl">QUICK LINKS</h1>
                    <Link href="/" className="text-base">
                        Home
                    </Link>
                    <Link href="/" className="text-base">
                        About Us
                    </Link>
                    <Link href="/" className="text-base">
                        Amenities
                    </Link>
                    <Link href="/" className="text-base">
                        Rooms & Rates
                    </Link>
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="text-2xl">HELP</h1>
                    <Link href="/" className="text-base">
                        Customer Support
                    </Link>
                    <Link href="/" className="text-base">
                        Hotel Details
                    </Link>
                    <Link href="/" className="text-base">
                        Terms & Conditions
                    </Link>
                    <Link href="/" className="text-base">
                        Privacy Policy
                    </Link>
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="text-2xl">HELP</h1>
                    <Link href="/" className="text-base flex flex-row gap-2">
                        <IconPhone /> +1 800 123 456 789
                    </Link>
                    <Link href="/" className="text-base flex flex-row gap-2">
                        <IconSend /> maxandreahotel@gmail.com
                    </Link>
                </div>
            </div>
        </div>
    );
}
