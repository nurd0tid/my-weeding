"use client";
import Image from "next/image";
import AOS from "aos";
import { useEffect, useState } from "react";
import Link from "next/link";
import "aos/dist/aos.css";
import { useSearchParams } from "next/navigation";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Submission {
  name: string;
  attendance: string;
  message: string;
  timestamp: string;
}

interface AttendanceOption {
  id: number;
  name: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const guest = searchParams.get("guest");
  const [openInvitation, setOpenInvitation] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("home");
  const [init, setInit] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [eventStarted, setEventStarted] = useState(false);
  const [queryAttendance, setQueryAttendance] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    AOS.init(); // Inisialisasi AOS

    // Mengambil tanggal saat ini dan memformatnya
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("id-ID", options);
    setCurrentDate(formattedDate);

    // Menghitung countdown
    const eventDate = new Date("2025-01-11T00:00:00");
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setEventStarted(true);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const attendance: AttendanceOption[] = [
    { id: 1, name: "Hadir" },
    { id: 2, name: "Belum Pasti" },
    { id: 3, name: "Tidak Hadir" },
  ];

  const filteredPeople =
    queryAttendance === ""
      ? attendance
      : attendance.filter((person) => {
          return person.name.toLowerCase().includes(queryAttendance.toLowerCase());
        });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: guest,
        attendance: selectedAttendance,
        message,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(data.message);
      // Reset form
      setSelectedAttendance("");
      setMessage("");
      // Fetch updated submissions
      fetchSubmissions();
    } else {
      toast.error("Failed to submit data");
    }
  };

  const fetchSubmissions = async () => {
    const response = await fetch("/api/submit");
    const data = await response.json();
    setSubmissions(data);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Berhasil disalin!");
      })
      .catch((err) => {
        toast.error("Gagal menyalin teks: ", err);
      });
  };

  useEffect(() => {
    if (openInvitation) {
      const audio = document.getElementById("audio") as HTMLAudioElement;
      if (audio) {
        audio.play().catch((err) => console.error("Failed to play audio:", err));
      }
    }
  }, [openInvitation]);

  const toggleAudio = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <body className={`light ${!openInvitation ? "overflow-hidden" : ""}`} data-aos-easing="ease" data-aos-duration="400" data-aos-delay="0">
      <div className="overclosed">
        <main
          className={`${
            !openInvitation
              ? "header max-h-full bg-cover h-full !fixed flex flex-row items-center w-full z-[9999] transition-all duration-300 ease-in-out overflow-hidden before:w-full before:min-h-full before:bg-[rgba(0,0,0,0.5)] before:block before:absolute before:top-0 before:left-0 before:content-['']"
              : "opacity-50 max-h-0 h-full !fixed flex flex-row items-center w-full z-[9999] transition-all duration-300 ease-in-out overflow-hidden"
          } `}
          style={{
            backgroundImage: "url('/assets/A4b2We4azzMsSGLCwjNqsjzQi4PRNLNY.jpeg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="p-8 text-white text-center m-auto">
            <div data-aos="fade-up" data-aos-delay="200" className="aos-init aos-animate">
              <Image src="/assets/wedding.svg" width={200} height={200} alt="Wedding" className="mb-3 m-auto" priority />
              <h3 className="text-3xl font-medium">Hello, We Are Getting Married</h3>
              <br />
              <h2 className="text-2xl font-medium">- Save The Date -</h2>
              {guest && (
                <>
                  <div data-aos="fade-up" className="mb-5 pt-2 aos-init aos-animate">
                    <i>Dear</i>
                    <h2 className="text-xl capitalize font-medium">{guest}</h2>
                    <i>Di Tempat</i>
                  </div>
                  <br />
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 inline-flex px-4 py-2 hover:opacity-70 rounded animate-slow-ease-in-out"
                    onClick={() => setOpenInvitation(true)}
                  >
                    Open Invitation
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
        <div
          id="home"
          className="curved page-holder bg-cover overflow-hidden before:w-full before:min-h-full before:bg-[rgba(0,0,0,0.5)] before:block before:absolute before:top-0 before:left-0 before:content-['']"
          style={{
            backgroundImage: "url('/assets/A4b2We4azzMsSGLCwjNqsjzQi4PRNLNY.jpeg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex h-screen m-auto mb-20 flex-col text-center text-white">
            <div className="m-auto">
              <div data-aos="fade-down" data-aos-duration="3000" className="aos-init aos-animate">
                <Image src="/assets/wedding.svg" width={250} height={250} alt="Wedding" className="mb-3 m-auto" priority />
                <h4 className="mb-5">We Are Getting Married</h4>
                <h1 className="text-[6rem] font-[300] leading-[1.2] mb-8">Nur & Balqis</h1>
                {/* <h5>Sabtu, 11 Januari 2025</h5> */}
                <h5>{currentDate}</h5>
              </div>
            </div>
            <div data-aos="fade-up" className="mt-3 pt-5 aos-init aos-animate">
              <i>Dear</i>
              <h4 className="caption text-secondary mt-1 capitalize">{guest}</h4>
              <i>Di Tempat</i>
            </div>
          </div>
          <div className="triangle"></div>
          {init && (
            <Particles
              id="tsparticles"
              options={{
                particles: {
                  color: {
                    value: "#ffffff",
                  },
                  links: {
                    color: "#ffffff",
                    distance: 100,
                    enable: false,
                    opacity: 0.5,
                    width: 1,
                  },
                  move: {
                    direction: "bottom",
                    enable: true,
                    outModes: {
                      default: "out",
                    },
                    random: true,
                    speed: 5,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                    },
                    value: 150,
                  },
                  opacity: {
                    value: { min: 0.2, max: 0.4 },
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    value: { min: 5, max: 10 },
                  },
                },
                detectRetina: true,
              }}
            />
          )}
        </div>
        <section className="text-center">
          <div className="max-w-xl m-auto text-center px-5 information-content">
            <div>
              <h2 className="caption text-4xl mb-5 caption-notes font-medium">Notes</h2>
              <div className=" mb-10 content-notes text-center">
                <div className="max-w-[500px] m-auto">
                  <div className="font-bold border-b border-black inline-block mb-[10px] text-[1.1rem]">Protokol Covid-19</div>
                  <br />
                  <p>
                    Dalam upaya mengurangi penyebaran Covid 19 pada masa pandemi, kami harapkan kedatangan para tamu undangan agar menjalankan protokol yang
                    berlaku.
                  </p>
                  <table className="text-[0.9rem] m-auto">
                    <tbody>
                      <tr>
                        <td className="w-[50%] ">
                          <img src="/assets/masker.png" alt="Masker" className="max-w-[80px] m-auto " />
                          <br />
                          Wajib Menggunakan Masker
                        </td>
                        <td className="w-[50%]">
                          <img src="/assets/distance.png" alt="Masker" className="max-w-[80px] m-auto " />
                          <br />
                          Saling Menjaga Jarak di Dalam Acara
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[50%]">
                          <img src="/assets/salam.png" alt="Masker" className="max-w-[80px] m-auto " />
                          <br />
                          Menggunakan salam namastee sebagai ganti berjabat tangan
                        </td>
                        <td className="w-[50%]">
                          <img src="/assets/wash.png" alt="Masker" className="max-w-[80px] m-auto " />
                          <br />
                          Jaga Kebersihan dengan Mencuci Tangan atau Handsanitizer
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="profile" className="profile relative">
          <div className="container">
            <div className="flex w-full justify-center items-center mb-10">
              <h2 className="caption text-4xl my-0 mx-5 font-medium">Nur & Balqis</h2>
            </div>
            <p className="mb-10">
              <i>Assalamu’alaikum Warahmatullahi Wabarakatuh</i>
              <br />
              <br />
              Maha suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan.
              <br />
              Ya Allah, perkenankanlah kami merangkai kasih sayang yang Kau ciptakan di antara putra-putri kami:
              <br />
            </p>
            <div className="flex flex-col sm:space-x-8 sm:flex-row justify-center">
              <div data-aos="fade-up" data-aos-duration="2000" data-aos-delay="000" className="p-5 couples flex-1 aos-init aos-animate">
                <div className="border-green-600 mb-5 couple-ring px-5 relative max-w-sm mx-auto">
                  <img src="/assets/mPpWpJBGmqsSRhp257ltBJagYYtTEsyX.jpeg" alt="Nur" loading="lazy" className="m-auto" />
                </div>
                <div>
                  <h2 className="font-medium text-3xl mb-4">- Nur -</h2>
                  <h3 className="text-3xl mb-3 caption font-medium">Muhamad Nur</h3>
                  <p className="text-secondary">Putra Pertama dari Pasangan</p>
                  <p className="text-secondary">Kidup &amp; Maimunah</p>
                  <p className="mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="24px"
                      height="24px"
                      className="inline-flex w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>{" "}
                    Jakarta
                  </p>
                </div>
              </div>
              <div data-aos="fade-up" data-aos-duration="2000" data-aos-delay="100" className="p-5 couples flex-1 aos-init aos-animate">
                <div className="border-green-600 mb-5 couple-ring px-5 relative max-w-sm mx-auto">
                  <img src="/assets/3sUy6HQYXtS2XkWDJRhN54syiT8bXsVo.jpeg" alt="Nur" loading="lazy" className="m-auto" />
                </div>
                <div>
                  <h2 className="font-medium text-3xl mb-4">- Balqis -</h2>
                  <h3 className="text-3xl mb-3 caption font-medium">Balqis Al Dayna</h3>
                  <p className="text-secondary">Putri Pertama dari Pasangan</p>
                  <p className="text-secondary">Erna &amp; Taufik</p>
                  <p className="mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="24px"
                      height="24px"
                      className="inline-flex w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>{" "}
                    Tangerang
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="agenda" className="location">
          <div className="m-auto max-w-5xl py-20 p-4">
            <div>
              <div className="flex flex-wrap justify-center">
                <div
                  data-aos="fade-down"
                  data-aos-duration="2000"
                  data-aos-delay="000"
                  className="w-full flex flex-col p-2 sm:w-1/2 lg:w-1/3 information-wrap mb-10 aos-init aos-animate"
                >
                  <div className="border-gray-300 flex flex-col flex-1 px-8 py-8 information bg-white bg-opacity-70 shadow-md rounded text-center">
                    <h3 className="text-secondary caption mb-4 text-3xl font-medium">Akad Nikah</h3> <p className="font-bold">Jumat, 10 Januari 2025</p>{" "}
                    <p>08:00 - 09:00 WIB</p> <p className="mt-2 font-bold">Masjid</p>{" "}
                    <p className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="24px"
                        height="24px"
                        className="inline-flex w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>{" "}
                      Jl. Belum Di Tentukan
                    </p>{" "}
                    <Link
                      target="_blank"
                      href="https://goo.gl/maps/UpMY7rYRm5VXnvNNA"
                      className="bg-gray-300 w-fit m-auto px-3 py-1 text-xs rounded-md hover:opacity-70"
                    >
                      Google Map
                    </Link>
                  </div>
                </div>
                <div
                  data-aos="fade-down"
                  data-aos-duration="2000"
                  data-aos-delay="100"
                  className="w-full flex flex-col p-2 sm:w-1/2 lg:w-1/3 information-wrap mb-10 aos-init aos-animate"
                >
                  <div className="border-gray-300 flex flex-col flex-1 px-8 py-8 information bg-white bg-opacity-70 shadow-md rounded text-center">
                    <h3 className="text-secondary caption mb-4 text-3xl font-medium">Resepsi</h3> <p className="font-bold">Jumat, 10 Januari 2025</p>{" "}
                    <p>08:00 - 09:00 WIB</p> <p className="mt-2 font-bold">Masjid</p>{" "}
                    <p className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="24px"
                        height="24px"
                        className="inline-flex w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>{" "}
                      Jl. Belum Di Tentukan
                    </p>{" "}
                    <Link
                      target="_blank"
                      href="https://goo.gl/maps/UpMY7rYRm5VXnvNNA"
                      className="bg-gray-300 w-fit m-auto px-3 py-1 text-xs rounded-md hover:opacity-70"
                    >
                      Google Map
                    </Link>
                  </div>
                </div>
                <div
                  data-aos="fade-down"
                  data-aos-duration="2000"
                  data-aos-delay="200"
                  className="w-full flex flex-col p-2 sm:w-1/2 lg:w-1/3 information-wrap mb-10 aos-init aos-animate"
                >
                  <div className="border-gray-300 flex flex-col flex-1 px-8 py-8 information bg-white bg-opacity-70 shadow-md rounded text-center">
                    <h3 className="text-secondary caption mb-4 text-3xl font-medium">Unduh Mantu</h3> <p className="font-bold">Jumat, 10 Januari 2025</p>{" "}
                    <p>08:00 - 09:00 WIB</p> <p className="mt-2 font-bold">Masjid</p>{" "}
                    <p className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="24px"
                        height="24px"
                        className="inline-flex w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>{" "}
                      Jl. Belum Di Tentukan
                    </p>{" "}
                    <Link
                      target="_blank"
                      href="https://goo.gl/maps/UpMY7rYRm5VXnvNNA"
                      className="bg-gray-300 w-fit m-auto px-3 py-1 text-xs rounded-md hover:opacity-70"
                    >
                      Google Map
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="gallery" className="gallery relative">
          <div className="container text-center">
            <div className="flex w-full justify-center items-center mb-10">
              <h2 className="caption text-4xl my-0 mx-5 font-medium">Our Gallery</h2>
            </div>
            <div>
              <div id="silentbox-gallery" className="grid grid-cols-2 sm:grid-cols-4 gap-2 content-around">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Link key={index} href="#" className="silentbox-item">
                    <img src={`/assets/${index + 1}.jpeg`} alt={`Gallery ${index + 1}`} />
                  </Link>
                ))}
              </div>
            </div>
            <h2 className="caption text-4xl mb-5 mt-16 font-medium">Our Video</h2>
            <div>
              <div className="videoWrapper">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/hG_yZXiR45k?si=O-Q91mcwAVQMIK3n"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-8">
                <div>
                  <Link href="#" target="_blank" className="bg-gray-300 text-gray-800 inline-flex px-4 py-2 hover:opacity-70 rounded">
                    Live Instagram
                  </Link>
                </div>
                <div>
                  <Link href="#" target="_blank" className="bg-gray-300 text-gray-800 inline-flex px-4 py-2 hover:opacity-70 rounded">
                    Live Youtube
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="parallax"
          style={{
            backgroundImage: "url('/assets/BnOe0heagGV6DQCelmJcSIcplemQPFCB.jpeg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="container my-10 sm:my-40 relative">
            <h2 className="caption text-4xl mb-5 font-medium">Our Quote</h2>
            <div className="w-full flex flex-col p-2 justify-center items-start">
              <div className="w-full p-5">
                <div data-aos="fade-up" data-aos-duration="2000" data-aos-delay="000" className="aos-init aos-animate">
                  <p className="mt-2">Tidak ada solusi yang lebih baik bagi dua insan yang saling mencintai di banding pernikahan.</p>
                  <h3 className="text-2xl caption mt-3 font-medium text-secondary">HR. Ibnu Majah</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="story" className="story">
          <div className="container sm:my-30">
            <h2 className="caption text-4xl mb-10 font-medium">Our Story</h2>
            <div className="flex space-y-2 justify-center text-center flex-col">
              <div data-aos="fade-right" data-aos-duration="2000" data-aos-delay="000" className="w-full p-2 aos-init aos-animate">
                <div className="flex flex-col md:flex-row md:space-x-5">
                  <div className="w-full md:w-1/3 mt-2">
                    <img src="/assets/l2W5qITuGF215OhPRoRfZcYffxeQ6HRD.jpeg" alt="image" className="mb-5 rounded-md lg:w-44 w-auto m-auto" />
                  </div>
                  <div className="w-full md:text-left">
                    <h3 className="text-2xl font-bold text-secondary">Pertama Kenal</h3>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
                      since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    <p className="my-2 flex justify-center md:justify-start space-x-4">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          width="24px"
                          height="24px"
                          className="inline-flex w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>{" "}
                        Gramedia
                      </span>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          width="24px"
                          height="24px"
                          className="inline-flex w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>{" "}
                        01 Januari 2020
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div data-aos="fade-right" data-aos-duration="2000" data-aos-delay="100" className="w-full p-2 aos-init aos-animate">
                <div className="flex flex-col md:flex-row md:space-x-5">
                  <div className="w-full md:w-1/3 mt-2">
                    <img src="/assets/FlNx8A6ClD1ZEt2gzeX56sKJPeNaqeex.jpeg" alt="image" className="mb-5 rounded-md lg:w-44 w-auto m-auto" />
                  </div>{" "}
                  <div className="w-full md:text-left">
                    <h3 className="text-2xl font-bold text-secondary">Menyatakan Cinta</h3>{" "}
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
                      since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                    </p>{" "}
                    <p className="my-2 flex justify-center md:justify-start space-x-4">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          width="24px"
                          height="24px"
                          className="inline-flex w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>{" "}
                        Pantai Parangtritis
                      </span>{" "}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          width="24px"
                          height="24px"
                          className="inline-flex w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>{" "}
                        10 Januari 2020
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div data-aos="fade-right" data-aos-duration="2000" data-aos-delay="200" className="w-full p-2 aos-init">
                <div className="flex flex-col md:flex-row md:space-x-5">
                  <div className="w-full md:w-1/3 mt-2">
                    <img src="/assets/IN2IzZ9JSsrA4V6HCev2UVc02MDpew7g.jpeg" alt="image" className="mb-5 rounded-md lg:w-44 w-auto m-auto" />
                  </div>{" "}
                  <div className="w-full md:text-left">
                    <h3 className="text-2xl font-bold text-secondary">Tunangan</h3>{" "}
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
                      since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                    </p>{" "}
                    <p className="my-2 flex justify-center md:justify-start space-x-4">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          width="24px"
                          height="24px"
                          className="inline-flex w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>{" "}
                        Rumah Juliet
                      </span>{" "}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          width="24px"
                          height="24px"
                          className="inline-flex w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>{" "}
                        19 Januari 2020
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container">
          <h2 className="caption text-4xl mb-5 font-medium">Countdown</h2>
          <div>
            {!eventStarted ? (
              <div className="grid grid-cols-4 justify-center gap-4">
                <div data-aos="fade-down" data-aos-delay="200" className="rounded-md bg-amber-600 p-3 aos-init aos-animate">
                  <span className="number text-3xl text-white font-bold">{countdown.days}</span>
                  <div className="format text-xs sm:text-base text-white">Hari</div>
                </div>
                <div data-aos="fade-down" data-aos-delay="300" className="rounded-md bg-amber-600 p-3 aos-init aos-animate">
                  <span className="number text-3xl text-white font-bold">{countdown.hours}</span>
                  <div className="format text-xs sm:text-base text-white">Jam</div>
                </div>
                <div data-aos="fade-down" data-aos-delay="400" className="rounded-md bg-amber-600 p-3 aos-init aos-animate">
                  <span className="number text-3xl text-white font-bold">{countdown.minutes}</span>
                  <div className="format text-xs sm:text-base text-white">Menit</div>
                </div>
                <div data-aos="fade-down" data-aos-delay="500" className="rounded-md bg-amber-600 p-3 aos-init aos-animate">
                  <span className="number text-3xl text-white font-bold">{countdown.seconds}</span>
                  <div className="format text-xs sm:text-base text-white">Detik</div>
                </div>
              </div>
            ) : (
              <div className="message block text-center text-3xl text-amber-600 font-bold">Event Sedang Berlangsung</div>
            )}
          </div>
        </section>
        <section id="gift" className="container gift">
          <h2 className="caption text-4xl mb-5 font-medium">Gift</h2>
          <ul role="list" className="flex flex-wrap flex-col md:flex-row mt-5 m-auto justify-center">
            <li className="w-full md:w-1/2 p-2">
              <div
                data-aos="zoom-in-up"
                data-aos-duration="2000"
                data-aos-delay="000"
                className="bg-white rounded-lg shadow transition-shadow duration-200 hover:shadow-lg divide-y divide-gray-200 overflow-hidden aos-init aos-animate"
              >
                <div className="w-full flex items-center justify-between p-6">
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-amber-500 inline-block text-sm font-semibold uppercase">BCA</span>
                        <h4 className="text-gray-900 text-sm font-medium">Muhamad Nur</h4>
                      </div>
                      <img src="/assets/bca.jpg" alt="logo bank" loading="lazy" className="w-auto h-8 bg-gray-300 rounded-full flex-shrink-0" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 px-6 py-4">
                  <p className="mt-1 text-gray-500 text-sm tracking-widest">123456789</p>{" "}
                  <svg
                    onClick={() => copyToClipboard("123456789")}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="24px"
                    height="24px"
                    className="text-gray-500 w-5 h-5 hover:text-black cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    ></path>
                  </svg>
                </div>
              </div>
            </li>
            <li className="w-full md:w-1/2 p-2">
              <div
                data-aos="zoom-in-up"
                data-aos-duration="2000"
                data-aos-delay="100"
                className="bg-white rounded-lg shadow transition-shadow duration-200 hover:shadow-lg divide-y divide-gray-200 overflow-hidden aos-init aos-animate"
              >
                <div className="w-full flex items-center justify-between p-6">
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-amber-500 inline-block text-sm font-semibold uppercase">ALAMAT</span>
                        <h4 className="text-gray-900 text-sm font-medium">Muhamad Nur</h4>
                      </div>
                      <img src="/assets/alamat.jpg" alt="logo bank" loading="lazy" className="w-auto h-8 bg-gray-300 rounded-full flex-shrink-0" />
                    </div>
                  </div>
                </div>
                <div className="text-left px-6 py-4 text-gray-500 text-sm">Jl. Lorem Ipsum No.1, Kec. Dolor, Kab. Sit Amet</div>
              </div>
            </li>
            <li className="w-full md:w-1/2 p-2">
              <div
                data-aos="zoom-in-up"
                data-aos-duration="2000"
                data-aos-delay="200"
                className="bg-white rounded-lg shadow transition-shadow duration-200 hover:shadow-lg divide-y divide-gray-200 overflow-hidden aos-init aos-animate"
              >
                <div className="w-full flex items-center justify-between p-6">
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-amber-500 inline-block text-sm font-semibold uppercase">QRCODE / QRIS </span>
                        <h4 className="text-gray-900 text-sm font-medium"></h4>
                      </div>
                    </div>
                  </div>
                  <img src="/assets/iao8blunwz.png/" alt="logo bank" loading="lazy" className="w-auto h-28 flex-shrink-0" />
                </div>
                <div className="text-left px-6 py-4 text-gray-500 text-sm">OVO</div>
              </div>
            </li>
          </ul>
        </section>
        <section id="guestbook" className="guestbook">
          <div className="container">
            <h2 className="caption text-4xl mb-5 font-medium">Guest Book</h2>
            <div className="max-w-2xl mx-auto w-full">
              <form onSubmit={handleSubmit} className="card bg-white text-gray-800 rounded-md p-4 mb-5 text-sm shadow relative z-10">
                <div className="flex flex-wrap">
                  <div className="w-full md:w-full px-3 mb-2 mt-2 space-y-2">
                    <div>
                      <label htmlFor="name" className="flex justify-between">
                        <span className="block text-sm font-medium text-gray-700">Nama</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="appearance-none block w-full p-3 min-h-[46px] border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pinky-500 focus:border-pinky-500 text-sm bg-gray-100 cursor-not-allowed  border-gray-300 dark:border-gray-warm"
                          placeholder="Nama"
                          disabled
                          value={guest!}
                        />
                      </div>
                    </div>
                    <div className="block w-full">
                      <label className="block text-sm font-medium text-gray-700 text-left">Kedatangan</label>
                      <Combobox value={selectedAttendance} onChange={(value) => setSelectedAttendance(value!)} onClose={() => setQueryAttendance("")}>
                        <div className="relative">
                          <ComboboxInput
                            className={clsx("text-sm border rounded w-full h-11 mt-2 bg-white border-gray-300 dark:border-gray-300 p-3")}
                            onChange={(event) => setQueryAttendance(event.target.value)}
                            displayValue={(person) => person.name}
                          />
                          <ComboboxButton className="group absolute inset-y-6 right-0 px-2.5">
                            <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                          </ComboboxButton>
                        </div>

                        <ComboboxOptions className="absolute z-10 mt-1 w-auto bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {filteredPeople.length === 0 && queryAttendance !== "" ? (
                            <div className="cursor-default select-none relative py-2 px-4 text-gray-700">Tidak ada hasil</div>
                          ) : (
                            filteredPeople.map((person) => (
                              <ComboboxOption
                                key={person.id}
                                value={person}
                                className={({ active }) =>
                                  `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? "text-white bg-indigo-600" : "text-gray-900"}`
                                }
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{person.name}</span>
                                    {selected ? (
                                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-indigo-600"}`}>
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </ComboboxOption>
                            ))
                          )}
                        </ComboboxOptions>
                      </Combobox>
                    </div>
                    <div>
                      <label htmlFor="message" className="flex justify-between">
                        <span className="block text-sm font-medium text-gray-700"> Ucapan / Doa</span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="message"
                          name="message"
                          cols={30}
                          rows={3}
                          className="shadow-sm bg-white focus:outline-none focus:ring-pinky-500 focus:border-pinky-500 mt-1 block w-full sm:text-sm border rounded-md p-3 text-sm border-gray-300"
                          placeholder="Tulis Ucapan / Doa"
                          value={message!}
                          onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-end px-3">
                  <div>
                    <button
                      type="submit"
                      className="bg-white text-gray-700 font-medium cursor-pointer py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              </form>
              <div className="bg-white text-gray-800 p-4 pr-0 rounded-md shadow">
                <div className="flex flex-col space-y-3 h-80 overflow-y-scroll">
                  {submissions && submissions.length > 0 ? (
                    submissions.map((submission, index) => (
                      <div key={index} className={`flex space-x-2 mr-4 mb-4`}>
                        <div className="flex flex-shrink-0 self-start cursor-pointer">
                          <img src="/assets/profile.jpeg" alt="avatar" className="h-8 w-8 object-fill border rounded-full" />
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-left">
                          <div className="block">
                            <div className={`bg-gray-100 w-auto rounded-xl px-4 pt-2 pb-2`}>
                              <div>
                                <span className="text-sm font-semibold">{submission.name}</span>
                                <span
                                  className={`mx-1 inline-block px-2 py-0.5 text-xs font-medium rounded-md ${
                                    submission.attendance === "Hadir"
                                      ? "bg-green-100 text-green-800"
                                      : submission.attendance === "Belum Pasti"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {submission.attendance}
                                </span>
                              </div>
                              <div className="text-sm">{submission.message}</div>
                            </div>
                            <div className="flex justify-start items-center text-xs w-full">
                              <div className="font-semibold text-gray-700 px-2 flex items-center justify-center">
                                <small>{new Date(submission.timestamp).toLocaleString()}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <span className="text-gray-500">Belum ada ucapan</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div>
          <div className="fixed bottom-4 z-50 left-0 right-0 w-fit m-auto px-2">
            <div className="bg-white relative flex justify-between px-2 sm:px-6 overflow-hidden shadow rounded-2xl">
              <nav className="scrollactive-nav flex items-center justify-between sm:gap-6 min-w-min">
                <Link
                  href="#home"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "home" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("home")}
                >
                  <span className="sr-only">Beranda</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Beranda</div>
                  </div>
                </Link>
                <Link
                  href="#profile"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "profile" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("profile")}
                >
                  <span className="sr-only">Profil</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Profil</div>
                  </div>
                </Link>
                <Link
                  href="#agenda"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "agenda" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("agenda")}
                >
                  <span className="sr-only">Acara</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Acara</div>
                  </div>
                </Link>
                <Link
                  href="#gallery"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "gallery" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("gallery")}
                >
                  <span className="sr-only">Galeri</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Galeri</div>
                  </div>
                </Link>
                <Link
                  href="#story"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "story" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("story")}
                >
                  <span className="sr-only">Cerita</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Cerita</div>
                  </div>
                </Link>
                <Link
                  href="#gift"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "gift" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("gift")}
                >
                  <span className="sr-only">Hadiah</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Hadiah</div>
                  </div>
                </Link>
                <Link
                  href="#guestbook"
                  className={`scrollactive-item grid w-12 h-16 sm:w-16 sm:h-16 pt-1 grid-cols-1 grid-rows-1 ${
                    activeSection === "guestbook" ? "border-b-4 border-amber-600" : ""
                  }`}
                  onClick={() => handleNavClick("guestbook")}
                >
                  <span className="sr-only">Ucapan</span>
                  <div className="col-[1/1] row-[1/1] flex items-center justify-center flex-col sm:w-16 h-14 space-y-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      className="text-amber-500 flex-shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <div className="text-amber-500 sm:text-xs text-[0.60rem]">Ucapan</div>
                  </div>
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div>
          <audio id="audio" src="/assets/qRwWgRqE8D.mp3" autoPlay loop>
            <source src="/assets/qRwWgRqE8D.mp3" type="audio/mpeg" />
            Your browser does not support the audio play.
          </audio>
          <button
            onClick={toggleAudio}
            className="text-white bg-amber-500 fixed z-50 bottom-24 sm:bottom-5 left-5 w-10 h-10 flex items-center justify-center rounded-full shadow"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 256 256"
              xmlSpace="preserve"
              className={`w-8 h-8 ${isPlaying ? "animate-spin" : ""}`}
            >
              <g>
                <g>
                  <g>
                    <path
                      fill="#ffffff"
                      d="M128,118.8c5.1,0,9.2,4.1,9.2,9.2c0,5.1-4.1,9.2-9.2,9.2c-5.1,0-9.2-4.1-9.2-9.2C118.8,122.9,122.9,118.8,128,118.8z"
                    ></path>
                    <path
                      fill="#ffffff"
                      d="M128,10C62.8,10,10,62.8,10,128c0,65.2,52.8,118,118,118c65.2,0,118-52.8,118-118C246,62.8,193.2,10,128,10z M44.7,84.7c-1,0-1.9-0.3-2.8-0.8c-2.4-1.5-3.1-4.7-1.5-7.1C53.8,56,74.2,40.2,97.6,32.3c2.7-0.9,5.6,0.5,6.5,3.2c0.9,2.7-0.6,5.6-3.3,6.5C79.6,49.2,61.2,63.5,49,82.4C48,83.9,46.4,84.7,44.7,84.7z M60.7,98.5c-0.9,0-1.9-0.3-2.7-0.8c-2.4-1.5-3.2-4.7-1.6-7.1c12-19.2,30.5-33.4,52.1-40c2.7-0.8,5.6,0.7,6.4,3.4c0.8,2.7-0.7,5.6-3.4,6.4c-19.2,5.8-35.7,18.4-46.3,35.6C64.1,97.6,62.4,98.5,60.7,98.5z M82.9,104.4c-1,1.5-2.6,2.3-4.3,2.3c-1,0-2-0.3-2.9-0.9c-2.4-1.6-3-4.8-1.4-7.2c9.1-13.4,22.4-23.6,37.7-28.8c2.7-0.9,5.6,0.6,6.5,3.3c0.9,2.7-0.6,5.6-3.3,6.5C102.2,84.1,90.7,92.9,82.9,104.4z M93.6,128c0-19,15.4-34.4,34.4-34.4s34.4,15.4,34.4,34.4S147,162.4,128,162.4S93.6,147,93.6,128z M128.1,185.2c-0.5-2.8,1.3-5.5,4.1-6c16.3-3.1,31.1-12.7,40.6-26.5c1.6-2.3,4.8-2.9,7.2-1.3c2.4,1.6,2.9,4.8,1.3,7.2c-11,16-28.2,27.2-47.2,30.8c-0.3,0.1-0.6,0.1-1,0.1C130.7,189.4,128.6,187.7,128.1,185.2z M131.8,204.3c-0.5-2.8,1.3-5.5,4.1-6c20.9-4,39.3-15.7,51.8-33c1.7-2.3,4.9-2.8,7.2-1.2c2.3,1.7,2.8,4.9,1.2,7.2c-14.1,19.4-34.8,32.6-58.2,37c-0.3,0.1-0.7,0.1-1,0.1C134.5,208.5,132.3,206.8,131.8,204.3z M213.1,180.4c-16.6,25.9-43.3,43.8-73.5,49.1c-0.3,0-0.6,0.1-0.9,0.1c-2.5,0-4.6-1.8-5.1-4.3c-0.5-2.8,1.4-5.5,4.2-6c27.3-4.8,51.6-21,66.6-44.5c1.5-2.4,4.7-3.1,7.1-1.6C213.9,174.8,214.6,178,213.1,180.4z"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
        <footer className="text-center text-xs pb-28 pt-10 text-gray-400">
          <Link href="#" title="Wedding Nur & Balqis" className="inline-block">
            Made with ❤️ by <span className="text-gray-500">Nur & Balqis</span>
          </Link>
          <ToastContainer />
        </footer>
      </div>
    </body>
  );
}
