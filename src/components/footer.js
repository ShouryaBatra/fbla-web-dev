import Link from "next/link";

const navigation = {
  about: [
    { name: "Home", href: "/" },
    { name: "Get Started", href: "/" },
    { name: "Benefits", href: "/" },
  ],

  positions: [{ name: "Careers", href: "/postings" }],

  apply: [{ name: "Application", href: "/postings" }],

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
        <div className="xl:grid grid-cols-3 xl:gap-8">
          {/* Logo and Title */}
          <Link
            href="/"
            className="space-x-3 sm:flex text-2xl rounded-md font-semibold cursor-pointer ease-linear duration-300"
          >
            <p className="mt-3 hidden md:block text-cream hover:text-gray-100">
              Homestead Careers
            </p>
          </Link>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:grid-cols-4 xl:col-span-2 xl:mt-0">
            {/* About Section */}
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

            {/* Positions Section */}
            <div>
              <h3 className="text-md font-semibold leading-6 text-cream">
                Positions
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.positions.map((item) => (
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

            {/* Apply Section - Moves to the bottom on mobile screens */}
            <div>
              <h3 className="text-md font-semibold leading-6 text-cream">
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
            {/* Legal Section */}
            <div>
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

        {/* Copyright Section */}
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
