import Container from '@/components/global/container';

export default function LocationComponent() {
    return (
        <Container>
            <div className="w-full h-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4855.700220287605!2d124.64805330000002!3d8.4779902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff2d0bebe4419%3A0x1ae0aa44e3d38bc5!2sMaxandrea%20Hotel!5e1!3m2!1sen!2sph!4v1760343119775!5m2!1sen!2sph"
                    width={'100%'}
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
        </Container>
    );
}
