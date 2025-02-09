import Image from "next/image";
import Link from "next/link";

const navigation = {
  about: [
    { name: "Home", href: "/" },
    { name: "Get Started", href: "/" },
    { name: "Benefits", href: "/" },
  ],
  apply: [
    { name: "Careers", href: "/postings" },
    { name: "Application", href: "/" },
  ],
  other: [{ name: "Other", href: "/" }],
  legal: [
    { name: "Privacy", href: "" },
    { name: "Terms", href: "" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="bg-dark-green mt-2 border-t-2 border-emerald-700 border-opacity-70"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-20 opacity-100">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <Link
            href="/"
            className="space-x-3 sm:flex text-2xl rounded-md 
                font-semibold cursor-pointer ease-linear duration-300"
          >
            <p className="mt-3 hidden md:block text-cream hover:text-gray-100">
              Homestead Careers
            </p>
          </Link>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-md font-semibold leading-6 text-cream">
                  About
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-md leading-6 text-cream-white hover:text-gray-100"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-md font-semibold leading-6 text-cream mt-10 md:mt-0">
                  Apply
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.apply.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-md leading-6 text-cream-white hover:text-gray-100"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-md font-semibold leading-6 text-cream">
                  Other
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.other.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-md leading-6 text-cream-white hover:text-gray-100"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-md font-semibold leading-6 text-cream">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-md leading-6 text-cream-white hover:text-gray-100"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-12 border-t border-cream pt-8 md:flex md:items-center md:justify-between">
          <p className="mt-8 text-md leading-5 text-neutral-300 md:order-1 md:mt-0">
            &copy; {new Date().getFullYear()} Homestead Careers. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
