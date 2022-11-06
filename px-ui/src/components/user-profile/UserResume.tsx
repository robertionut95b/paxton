import StudyCard from "@components/cards/StudyCard";
import { Divider, Title } from "@mantine/core";

export default function UserResume() {
    const studies = [1, 2]
    return (
        <div className="px-user-resume flex flex-col gap-y-5">
            <Title order={3}>
                About
            </Title>
            <div className="px-user-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lobortis ante at justo rhoncus tristique. Proin nec sapien non enim maximus laoreet. Aliquam bibendum congue tempor. Vivamus condimentum consectetur euismod. Duis lacus ex, dapibus at metus eu, maximus vulputate ante. Nunc accumsan sit amet dolor ut vestibulum. Fusce sit amet placerat nulla. Vivamus tristique, felis non scelerisque venenatis, elit nisi convallis diam, non auctor turpis odio vel odio. In ornare ornare euismod. Aenean neque lorem, commodo nec urna at, interdum porttitor massa. Aenean tempor sit amet diam nec ultricies. Nunc gravida justo sit amet lobortis porttitor. Proin interdum porttitor tincidunt. Phasellus dictum mauris odio, ac volutpat est tincidunt varius.
                <br /><br />
                Duis rutrum nisi non neque tristique accumsan. Aliquam in augue elementum, auctor tortor at, congue ipsum. Morbi dapibus quam vel neque tempor, in feugiat quam aliquet. Donec iaculis malesuada vulputate. Integer vel hendrerit sem. Nam volutpat lacus id viverra venenatis. Duis sit amet augue iaculis, commodo risus sit amet, facilisis sapien. Aliquam sed erat malesuada sem ultrices hendrerit. Curabitur facilisis nibh nibh, sed sagittis risus malesuada et.
            </div>
            <Divider color={"violet"} />
            <Title order={3}>
                Studies
            </Title>
            <div className="px-user-studies">
                {studies.map((s, idx) =>
                    <div key={idx} className="px-user-study mb-8">
                        {(studies.length - 1) === idx ? <StudyCard /> : <StudyCard withDivider />}
                    </div>
                )}
            </div>
            <Divider color={"violet"} />
            <Title order={3}>
                Work Experience
            </Title>
        </div>
    )
}